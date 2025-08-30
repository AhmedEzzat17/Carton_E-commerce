import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useParams } from 'react-router-dom';
import productService from '../services/interface/productService';
import ProductDetails from '../components/ProductDetails/ProductDetails';
import MostDemandedProducts from '../components/MostDemandedProducts/MostDemandedProducts';
import '../assets/css/style.css';
import '../assets/js/main.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      productService.getById(id)
        .then(res => {
          setProduct(res.data.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="text-center py-5">جارِ تحميل المنتج...</div>;

  if (!product) return <div className="text-center py-5">لم يتم العثور على المنتج</div>;

  return (
    <div>
      <ProductDetails product={product} />
      <MostDemandedProducts title="قد يعجبك ايضا" />

    </div>
  );
}

export default ProductPage;
