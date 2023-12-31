import React, { useEffect, useState } from 'react';
import '../style/TableStyle.css';
import axios from 'axios';
import Header from "./Header";
import PrimarySearchAppBar from "./Header";
import { useLocation } from 'react-router-dom';

const TableStyle = () => {  
  const location = useLocation();

  const [order, setOrder] = useState([]);
  const [result, setResult] = React.useState(0);
  const [noItems, setNoItems] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [countItem, setCountItem] = React.useState(0);
  const [orderId, setOrderId] = React.useState(0);
  const [articlesPanier, setArticlesPanier] = useState([]);
  
  const id = localStorage.getItem('id');
  const calcQuantity = (id) => {
    axios
      .get(`http://localhost:8000/api/count_item/${id}`)
      .then((response) => {
        // console.table(response.data['quantity'][0]['count']);
        setCountItem(response.data["quantity"][0]["count"]);
      })
      .catch((error) => {
        console.error(
          "Erreur veuillez vous connecter pour visualiser votre panier : ",
          error.response.data
        );
      });

    // console.log("in quantity function " + countItem);
  };

  const calcPrice = (ArticlesToGetPrice) => {
    var price_calc = 0;
    for (let count = 0; count < ArticlesToGetPrice.length; count++) {
      const element = ArticlesToGetPrice[count];
      price_calc += element.quantity * element.unit_price;
    }
    setPrice(price_calc);

    return price_calc;
  };

  const decryptData = async (encryptedData, key) => {
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(12) },
      key,
      encryptedData
    );

    const textDecoder = new TextDecoder();
    return textDecoder.decode(decryptedData);
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/order/user/${id}`)
      .then((response) => {
        
        const orderData = response.data;
        console.log("test")
        console.log(orderData);
        setOrder(orderData);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, [id]);

  return (
    // <BreadcrumbsComponent navigation={location} />
    <>
          <Header
        articlesPanier={articlesPanier}
        setArticlesPanier={setArticlesPanier}
        calcQuantity={calcQuantity}
        orderId={orderId}
        setOrderId={setOrderId}
        calcPrice={calcPrice}
        countItem={countItem}
        setCountItem={setCountItem}
        price={price}
        setPrice={setPrice}
        noItems={noItems}
        setNoItems={setNoItems}
        result={result}
        setResult={setResult}
      />
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
          <th>Id de commande</th>
            <th>Date de commande</th>
            <th>Adresse</th>
            <th>Mode d'expédition</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {order.map((listValue, index) => {
          return (
            <tr key={index}>
              <td>{listValue.id}</td>
              <td>{listValue.order_date}</td>
              <td>{listValue.delivery_address}</td>
              <td>{listValue.delivery_method}</td>
              <td>{listValue.status}</td>
              <td><a href={`http://localhost:3000/command/detail/${listValue.id}`}>En savoir plus</a></td>

            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default TableStyle;
