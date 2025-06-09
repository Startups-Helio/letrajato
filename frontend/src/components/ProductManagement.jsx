import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/ProductManagement.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    build_volume: '',
    layer_height: '',
    print_speed: '',
    nozzle_diameter: '',
    filament_diameter: '',
    heated_bed: false,
    auto_leveling: false,
    wifi_connectivity: false,
    touchscreen: false,
    enclosed_chamber: false,
    dual_extruder: false,
    category: 'printer',
    brand: '',
    model: '',
    weight: '',
    dimensions: '',
    power_consumption: '',
    operating_temperature: '',
    supported_materials: '',
    software_compatibility: '',
    warranty_period: '',
    image_url: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/letrajato/products/');
      setProducts(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingProduct) {
        await api.put(`/letrajato/products/${editingProduct.id}/`, formData);
        setSuccess('Produto atualizado com sucesso!');
      } else {
        await api.post('/letrajato/products/', formData);
        setSuccess('Produto criado com sucesso!');
      }
      
      resetForm();
      loadProducts();
    } catch (err) {
      setError('Erro ao salvar produto');
      console.error('Error saving product:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/letrajato/products/${productId}/`);
      setSuccess('Produto excluído com sucesso!');
      loadProducts();
    } catch (err) {
      setError('Erro ao excluir produto');
      console.error('Error deleting product:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      quantity: '',
      build_volume: '',
      layer_height: '',
      print_speed: '',
      nozzle_diameter: '',
      filament_diameter: '',
      heated_bed: false,
      auto_leveling: false,
      wifi_connectivity: false,
      touchscreen: false,
      enclosed_chamber: false,
      dual_extruder: false,
      category: 'printer',
      brand: '',
      model: '',
      weight: '',
      dimensions: '',
      power_consumption: '',
      operating_temperature: '',
      supported_materials: '',
      software_compatibility: '',
      warranty_period: '',
      image_url: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading-container">Carregando produtos...</div>;
  }

  return (
    <div className="product-management">
      <div className="product-header">
        <h3>Gerenciamento de Produtos</h3>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Adicionar Produto'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Preço *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Quantidade *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="printer">Impressora</option>
                <option value="filament">Filamento</option>
                <option value="accessory">Acessório</option>
                <option value="part">Peça</option>
              </select>
            </div>

            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Modelo</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Volume de Impressão</label>
              <input
                type="text"
                name="build_volume"
                value={formData.build_volume}
                onChange={handleInputChange}
                placeholder="ex: 220x220x250mm"
              />
            </div>

            <div className="form-group">
              <label>Altura da Camada</label>
              <input
                type="text"
                name="layer_height"
                value={formData.layer_height}
                onChange={handleInputChange}
                placeholder="ex: 0.1-0.3mm"
              />
            </div>

            <div className="form-group">
              <label>Velocidade de Impressão</label>
              <input
                type="text"
                name="print_speed"
                value={formData.print_speed}
                onChange={handleInputChange}
                placeholder="ex: 150mm/s"
              />
            </div>

            <div className="form-group">
              <label>Diâmetro do Bico</label>
              <input
                type="text"
                name="nozzle_diameter"
                value={formData.nozzle_diameter}
                onChange={handleInputChange}
                placeholder="ex: 0.4mm"
              />
            </div>

            <div className="form-group">
              <label>URL da Imagem</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="form-group">
              <label>Peso</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="ex: 8.5kg"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Descrição *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Materiais Suportados</label>
            <input
              type="text"
              name="supported_materials"
              value={formData.supported_materials}
              onChange={handleInputChange}
              placeholder="ex: PLA, ABS, PETG, TPU"
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="heated_bed"
                checked={formData.heated_bed}
                onChange={handleInputChange}
              />
              Mesa Aquecida
            </label>

            <label>
              <input
                type="checkbox"
                name="auto_leveling"
                checked={formData.auto_leveling}
                onChange={handleInputChange}
              />
              Auto Nivelamento
            </label>

            <label>
              <input
                type="checkbox"
                name="wifi_connectivity"
                checked={formData.wifi_connectivity}
                onChange={handleInputChange}
              />
              Conectividade WiFi
            </label>

            <label>
              <input
                type="checkbox"
                name="touchscreen"
                checked={formData.touchscreen}
                onChange={handleInputChange}
              />
              Tela Touch
            </label>

            <label>
              <input
                type="checkbox"
                name="enclosed_chamber"
                checked={formData.enclosed_chamber}
                onChange={handleInputChange}
              />
              Câmara Fechada
            </label>

            <label>
              <input
                type="checkbox"
                name="dual_extruder"
                checked={formData.dual_extruder}
                onChange={handleInputChange}
              />
              Extrusor Duplo
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              {editingProduct ? 'Atualizar' : 'Criar'} Produto
            </button>
          </div>
        </form>
      )}

      <div className="products-list">
        {products.length === 0 ? (
          <div className="no-products">
            <p>Nenhum produto cadastrado.</p>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Marca</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.category}</td>
                    <td>R$ {parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.brand || '-'}</td>
                    <td className="actions">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="delete-btn"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;