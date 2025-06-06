import React, { useEffect, useRef, useState } from 'react';
import '../styles/CalculoOrcamento.css';
import api from '../api';

function CalculoOrcamento() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const resultadoRef = useRef(null);
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);
  const alturaLabelRef = useRef(null);
  const espessuraInputRef = useRef(null);

  const [sendingEmail, setSendingEmail] = useState(false);

  // Variáveis globais
  const layerHeight = 0.55;
  const fixedDensity = 1.27;
  let svgElement, svgShapes = [], svgBBox = null, svgScale = 1;
  let areaReal = 0, perimeter = 0, estimate = 1;

  useEffect(() => {
    initializeEventListeners();

    return () => {
      // Cleanup listeners if needed
    };
  }, []);

  const initializeEventListeners = () => {
    const fileInput = fileInputRef.current;
    const slider = sliderRef.current;
    const alturaLabel = alturaLabelRef.current;
    const espessuraInput = espessuraInputRef.current;
    const btnCalcular = document.getElementById('btnCalcular');
    const btnReset = document.getElementById('btnReset');

    if (fileInput) fileInput.addEventListener('change', handleFile);
    if (slider) slider.addEventListener('input', () => {
      if (alturaLabel) alturaLabel.textContent = slider.value;
    });
    if (btnCalcular) btnCalcular.addEventListener('click', calcularConsumo);
    if (btnReset) btnReset.addEventListener('click', resetForm);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      if (canvasContainerRef.current) {
        canvasContainerRef.current.innerHTML = ev.target.result;
        setTimeout(processSVG, 100);
      }
    };
    r.readAsText(f);
  };

  const processSVG = () => {
    svgElement = document.querySelector('#canvas-container svg');
    if (!svgElement) return;
    
    const rawW = parseFloat(svgElement.getAttribute('width')) || 0;
    const vb = svgElement.getAttribute('viewBox').split(' ').map(Number);
    svgScale = rawW && vb[2] ? rawW / vb[2] : 1;
    
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');
    
    svgBBox = svgElement.getBBox();
    
    draw2DCotas();
    calculateMetrics();
  };

  const draw2DCotas = () => {
    const wrap = document.getElementById('canvas-wrapper');
    wrap.querySelectorAll('.wrapper-cota-h,.wrapper-cota-v,.wrapper-label-h,.wrapper-label-v').forEach(el => el.remove());
    
    const rect = svgElement.getBoundingClientRect();
    const wRect = wrap.getBoundingClientRect();
    const offX = rect.left - wRect.left;
    const offY = rect.top - wRect.top;
    const wPx = rect.width;
    const hPx = rect.height;
    const cmW = (svgBBox.width * svgScale / 10).toFixed(2) + ' cm';
    const cmH = (svgBBox.height * svgScale / 10).toFixed(2) + ' cm';
    
    const lineH = document.createElement('div');
    lineH.className = 'wrapper-cota-h';
    lineH.style.cssText = `left:${offX}px;top:${offY}px;width:${wPx}px;`;
    wrap.appendChild(lineH);
    
    const lineV = document.createElement('div');
    lineV.className = 'wrapper-cota-v';
    lineV.style.cssText = `left:${offX}px;top:${offY}px;height:${hPx}px;`;
    wrap.appendChild(lineV);
    
    const lblW = document.createElement('div');
    lblW.className = 'wrapper-label-h';
    lblW.innerText = cmW;
    lblW.style.cssText = `left:${offX + wPx / 2}px;top:${offY - 20}px;`;
    wrap.appendChild(lblW);
    
    const lblH = document.createElement('div');
    lblH.className = 'wrapper-label-v';
    lblH.innerText = cmH;
    lblH.style.cssText = `left:${offX - 20}px;top:${offY + hPx / 2}px;`;
    wrap.appendChild(lblH);
  };

  const calculateMetrics = () => {
    perimeter = 0;
    
    svgElement.querySelectorAll('path').forEach(p => 
      perimeter += p.getTotalLength() * svgScale
    );
    
    svgElement.querySelectorAll('polygon').forEach(poly => {
      const pts = poly.getAttribute('points').trim().split(/\s+/).map(pt => pt.split(',').map(Number));
      let sum = 0;
      pts.forEach((pt, i) => {
        const [x1, y1] = pt;
        const [x2, y2] = pts[(i + 1) % pts.length];
        sum += Math.hypot(x2 - x1, y2 - y1);
      });
      perimeter += sum * svgScale;
    });
    
    const areaTot = svgBBox.width * svgBBox.height * svgScale * svgScale;
    const cnv = canvasRef.current;
    const ctx = cnv.getContext('2d');
    const res = 2000;
    
    cnv.width = res;
    cnv.height = Math.round(res * svgBBox.height / svgBBox.width);
    ctx.clearRect(0, 0, res, cnv.height);
    
    const clone = svgElement.cloneNode(true);
    clone.removeAttribute('style');
    clone.querySelectorAll('defs,style').forEach(e => e.remove());
    clone.setAttribute('viewBox', svgElement.getAttribute('viewBox'));
    clone.setAttribute('width', res);
    clone.setAttribute('height', cnv.height);
    clone.setAttribute('fill-rule', 'evenodd');
    
    clone.querySelectorAll('path,polygon').forEach(e => {
      e.removeAttribute('class');
      e.setAttribute('fill', '#000');
      e.removeAttribute('stroke');
    });
    
    const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
    const img = new Image();
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, res, cnv.height);
      URL.revokeObjectURL(img.src);
      
      let cnt = 0;
      const data = ctx.getImageData(0, 0, res, cnv.height).data;
      
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) cnt++;
      }
      
      areaReal = areaTot * (cnt / (res * cnv.height));
    };
    
    img.src = URL.createObjectURL(blob);
  };

  const calcularConsumo = () => {
    if (!svgElement || areaReal <= 0) {
      alert('Envie e processe o SVG primeiro.');
      return;
    }
    
    const tipo = document.querySelector('input[name="tipoModelagem"]:checked').value;
    const acr = document.querySelector('input[name="acrilico"]:checked').value;
    const altura = +sliderRef.current.value;
    const fundo = +espessuraInputRef.current.value;
    const preco = 550;
    const den = fixedDensity;
    
    const largura = altura <= 40 ? 1.2 : 
                   altura <= 60 ? 1.5 : 
                   altura <= 80 ? 2 : 
                   altura <= 110 ? 2.5 : 3;
    
    const layersF = Math.ceil(fundo / layerHeight);
    const volT = areaReal * layersF * layerHeight + perimeter * largura * altura;
    const peso = volT / 1000 * den;
    
    let custo = peso / 1000 * preco;
    let custoAcr = 0;
    
    if (acr === '1') {
      const svgWidthMM = svgBBox.width * svgScale;
      const areaAcr = altura * svgWidthMM;
      custoAcr = areaAcr * 0.0075;
      custo += custoAcr;
    }
    
    if (tipo === '2') custo *= 2;
    
    let html = '<div class="estimativa-box">';
    html += `<p class="estimativa-label">Estimativa ${estimate}</p>`;
    html += `<p><strong>Altura da parede:</strong> ${altura} mm</p>`;
    html += `<p><strong>Espessura da parede:</strong> ${largura.toFixed(1)} mm</p>`;
    //html += (custoAcr > 0 ? `<p><strong>Cust. Acrílico:</strong> R$ ${custoAcr.toFixed(2)}</p>` : '');
    //html += `<p><strong>Peso:</strong> ${peso.toFixed(2)} g</p>`;
    html += `<p><strong>Custo Total:</strong> R$ ${custo.toFixed(2)}</p>`;
    html += '</div>';
    
    resultadoRef.current.innerHTML += html;
    estimate++;
  };

  const resetForm = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (canvasContainerRef.current) canvasContainerRef.current.innerHTML = '';
    if (resultadoRef.current) resultadoRef.current.innerHTML = '';

    const canvasWrapper = document.getElementById('canvas-wrapper');
    if (canvasWrapper) {
      canvasWrapper.querySelectorAll('.wrapper-cota-h, .wrapper-cota-v, .wrapper-label-h, .wrapper-label-v').forEach(el => {
        el.remove();
      });
    }
    
    if (sliderRef.current) sliderRef.current.value = 10;
    if (alturaLabelRef.current) alturaLabelRef.current.textContent = 10;
    if (espessuraInputRef.current) espessuraInputRef.current.value = 1;
    //if (precoInputRef.current) precoInputRef.current.value = 550;
    
    svgShapes = [];
    svgBBox = null;
    svgElement = null;
    areaReal = 0;
    perimeter = 0;
    estimate = 1;
  };

  const handleSendEmail = async () => {
    if (!resultadoRef.current || !resultadoRef.current.innerHTML.includes('Estimativa')) {
      alert('Realize pelo menos um cálculo antes de enviar o orçamento.');
      return;
    }
    
    setSendingEmail(true);
    
    try {
      // Get all calculation results
      const resultadosHTML = resultadoRef.current.innerHTML;
      
      // Get SVG data if available
      let svgData = '';
      let imageDataUrl = '';
      
      if (svgElement) {
        const svgWidth = (svgBBox.width * svgScale / 10).toFixed(2);
        const svgHeight = (svgBBox.height * svgScale / 10).toFixed(2);
        
        // SVG text information
        svgData = `
          <p><strong>Dimensões SVG:</strong> ${svgWidth} cm x ${svgHeight} cm</p>
          <p><strong>Área:</strong> ${(areaReal / 100).toFixed(2)} cm²</p>
          <p><strong>Perímetro:</strong> ${(perimeter / 10).toFixed(2)} cm</p>
        `;
        
        try {
          // Use canvas to render the SVG to PNG for the email
          const canvas = canvasRef.current;
          canvas.width = svgBBox.width * svgScale;
          canvas.height = svgBBox.height * svgScale;
          
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const svgClone = svgElement.cloneNode(true);
          const svgString = new XMLSerializer().serializeToString(svgClone);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          // Draw SVG to canvas and get data URL
          await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
              imageDataUrl = canvas.toDataURL('image/png');
              URL.revokeObjectURL(svgUrl);
              resolve();
            };
            img.src = svgUrl;
          });
        } catch (error) {
          console.error('Failed to convert SVG to image:', error);
        }
      }
      
      // Prepare email content
      const subject = 'Orçamento Letrajato';
      const message = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; }
              h2 { color: #ff5722; border-bottom: 2px solid #ff5722; padding-bottom: 10px; }
              .svg-details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
              .svg-container { text-align: center; margin: 20px 0; }
              .estimate-results { margin-top: 20px; }
              .estimativa-box { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
              .estimativa-label { font-weight: bold; color: #ff5722; }
              strong { color: #555; }
            </style>
          </head>
          <body>
            <h2>Orçamento Letrajato</h2>
            <div class="svg-details">
              ${svgData}
            </div>
            ${imageDataUrl ? `
              <div class="svg-container">
                <img src="${imageDataUrl}" alt="Design SVG" style="max-width:100%; border:1px solid #ddd; margin:10px 0; background-color:white;" />
              </div>
            ` : ''}
            <div class="estimate-results">
              ${resultadosHTML}
            </div>
            <p style="margin-top: 30px;">Agradecemos seu interesse em nossos serviços!</p>
            <p style="color: #777;">Equipe Letrajato</p>
          </body>
        </html>
      `;
      
      // Send email through API with the image data
      const response = await api.post('/letrajato/send-email/', {
        subject,
        message,
        image: imageDataUrl
      });
      
      if (response.status === 200) {
        alert('Orçamento enviado com sucesso!');
      } else {
        throw new Error('Falha ao enviar e-mail.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Erro ao enviar o e-mail: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="orcamento-container">
      
      <main className="orcamento-main">
        <section className="parametros-section">
          <h2 className="section-title">Parâmetros de Impressão</h2>
          <div className="form-container orcamento-form-container">
            <div className="form-group">
              <label className="form-label">Tipo de modelagem</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="tipoModelagem" value="1" defaultChecked />
                  <span>Batente acrílico<br/>(interno)</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="tipoModelagem" value="2" />
                  <span>Caixa de sapato<br/>(externo)</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Acrílico</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="acrilico" value="1" defaultChecked />
                  <span>Com acrílico: 3mm</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="acrilico" value="2" />
                  <span>Sem acrílico</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Arquivo SVG</label>
              <input 
                type="file" 
                id="svgFile" 
                accept=".svg" 
                className="file-input"
                ref={fileInputRef}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Altura da peça (mm): <span id="alturaValue" ref={alturaLabelRef} className="altura-value">10</span>
              </label>
              <input 
                type="range" 
                id="alturaPeca" 
                min="10" 
                max="130" 
                step="5" 
                defaultValue="10" 
                className="range-input"
                ref={sliderRef}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Espessura do fundo (mm)</label>
              <input 
                type="number" 
                id="espessuraFundo" 
                defaultValue="1" 
                step="0.1" 
                className="number-input"
                ref={espessuraInputRef}
              />
            </div>
            
            <div className="button-group">
              <button 
                id="btnCalcular" 
                className="btn btn-primary"
              >
                Calcular
              </button>
              <button 
                id="btnReset" 
                className="btn btn-secondary"
              >
                Resetar
              </button>
            </div>
          </div>
        </section>
        
        <section className="visualizacao-section">
          <div id="canvas-wrapper" className="canvas-wrapper">
            {svgElement &&
            <div>
            <div className="wrapper-cota-h"></div>
            <div className="wrapper-cota-v"></div>
            </div>
            }
            <div id="canvas-container" ref={canvasContainerRef} className="canvas-container"></div>
            {svgElement &&
            <div>
            <div id="wrapper-label-w" className="wrapper-label-h"></div>
            <div id="wrapper-label-h" className="wrapper-label-v"></div>
            </div>
            }
          </div>
          
          <h3 className="resultado-title">Resultados</h3>
          <div id="resultado" className="resultado" ref={resultadoRef}>
            
          </div>

          <div id="email-container" className="email-container">
            <h3 className="email-title">Enviar orçamento por e-mail</h3>
            <p className="email-description">Receba os resultados gerados em seu e-mail cadastrado.</p>
            <p className="email-description">O orçamento será enviado para nossa equipe, que entrará em contato brevemente.</p>
            <div className="email-button-container">
              <button
                id="btnEnviar"
                className="btn btn-primary"
                onClick={handleSendEmail}
                disabled={sendingEmail}>
                  {sendingEmail ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <canvas id="canvas" className="hidden-canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default CalculoOrcamento;
