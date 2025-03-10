import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getCartAmount() + 2,
    };
    let response = await axios.post(url + "/api/order/place", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            placeholder="First name"
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            placeholder="Last name"
            onChange={onChangeHandler}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          value={data.email}
          placeholder="Enter email address"
          onChange={onChangeHandler}
          required
        />
        <input
          type="text"
          name="street"
          value={data.street}
          placeholder="Street"
          onChange={onChangeHandler}
          required
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            value={data.city}
            placeholder="City"
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="state"
            value={data.state}
            placeholder="State"
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zipcode"
            value={data.zipcode}
            placeholder="Zip code"
            onChange={onChangeHandler}
            required
          />
          <input
            type="text"
            name="country"
            value={data.country}
            placeholder="Country"
            onChange={onChangeHandler}
            required
          />
        </div>
        <input
          type="text"
          name="phone"
          value={data.phone}
          placeholder="Phone"
          onChange={onChangeHandler}
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>$ {getCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>$ {getCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>$ {getCartAmount() === 0 ? 0 : getCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
