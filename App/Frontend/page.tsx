"use client";

import styles from './page.module.css';
import Link from 'next/link'
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import https from 'https'

//Establishes a connection with the backend Node.js server
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2001',
  timeout: 10000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    'Content-Type': 'application/json',
  },
});

const Home: React.FC = () => {

  //Type Declaration
  type MenuData = {
    _id: string;
    name: string;
    price: number;
    type: string;
  };

  type Ticket = {
    orderNumber: number;
    dateCreated: Date;
    orderItems: object[];
    totalPayment: number;
    status: string;
  }

  //Utilizes references to conserve the menu items between renders
  const menuRef = useRef<MenuData[]>([]);
  const entreeRef = useRef<MenuData[]>([]);
  const sidesRef = useRef<MenuData[]>([]);
  const drinksRef = useRef<MenuData[]>([]);
  const combosRef = useRef<MenuData[]>([]);

  //State definitions for rendering each menu list
  const [loadingBool, setLoadingBool] = useState<boolean>(true)
  const [entreeBool, setEntreeBool] = useState<boolean>(false);
  const [sidesBool, setSidesBool] = useState<boolean>(false);
  const [drinksBool, setDrinksBool] = useState<boolean>(false);
  const [combosBool, setCombosBool] = useState<boolean>(false);
  const [loadingCounter, setLoading] = useState<number>(0);

  //State utilized in the Order window
  const [orderState, setOrders] = useState<MenuData[]>([]);
  const [totalState, setTotal] = useState<string>("0.00");
  const [taxState, setTax] = useState<string>("0.00");
  const [grandTotal, setGrandTotal] = useState<string>("0.00");

  useEffect(() => {
    menuRef.current = []
    entreeRef.current = []
    sidesRef.current = []
    drinksRef.current = []
    combosRef.current = []

    //Loading Statement
    const interval = setInterval(() => {
      setLoading(0)
      const interval2 = setInterval(() => {
        setLoading(prev => prev + 1)
      }, 500)
      setTimeout(() => {
        clearInterval(interval2)
      }, 1500)
    }, 1500)

    setTimeout(() => {
      clearInterval(interval)
    }, 4500)

    setTimeout(() => {
      setLoadingBool(false)
      setEntreeBool(true)
    }, 6500)

    //Uses Axios to fetch all the menu items from MongoDB
    async function getMenu(): Promise<void> {
      try {
        const { data: response } = await axiosInstance.get('/menu/items');
        let menuDataArr: MenuData[] = [];
        menuDataArr = await response;
        menuRef.current = menuDataArr;
        sortMenu();
       
      }
      catch (err) {
        console.log("Unable to Fetch Menu", err);
      }
    }
    //Creates menu items list based on type of food
    function sortMenu(): void {
      menuRef.current.map((obj) => {
        if (obj.type == 'entree') {
          entreeRef.current = [...entreeRef.current, obj];
        }
        else if (obj.type == 'side') {
          sidesRef.current = [...sidesRef.current, obj];
        }
        else if (obj.type == 'drink') {
          drinksRef.current = [...drinksRef.current, obj];
        }
        else if (obj.type == 'combo') {
          combosRef.current = [...combosRef.current, obj];
        }
      })
    }
    getMenu();
  }, []);

  //Handles Rendering of each menu item
  function handleEntree() {
    setEntreeBool(true);
    setSidesBool(false);
    setDrinksBool(false);
    setCombosBool(false);
  }
  function handleSides() {
    setSidesBool(true);
    setEntreeBool(false);
    setDrinksBool(false);
    setCombosBool(false);
  }
  function handleDrinks() {
    setDrinksBool(true)
    setEntreeBool(false)
    setSidesBool(false)
    setCombosBool(false)
  }
  function handleCombos() {
    setCombosBool(true)
    setEntreeBool(false)
    setSidesBool(false)
    setDrinksBool(false)
  }

  //Adds item to the order display
  function addItem(obj:MenuData) {
    const newOrderArr = [...orderState, obj]
    setOrders(newOrderArr)
    newOrderArr.map((obj) => {
      let totalInt = Number(totalState) + Number((obj.price).toFixed(2));
      totalInt = Number(totalInt.toFixed(2))
      const taxStr = (totalInt * 0.0625).toFixed(2)
      const totalStr = (totalInt).toFixed(2)
      const grandTotal = (totalInt + Number(taxStr)).toFixed(2)
      setTotal(totalStr)
      setTax(taxStr)
      setGrandTotal(grandTotal)
    })

  }

  //Handles payments

  //Axios call that creates an entry in MongoDB
  async function postOrder(): Promise<void> {
    const newDate = new Date();
    const ticket: Ticket = {
      orderNumber: Math.floor(Math.random() * 1000000),
      dateCreated: newDate,
      orderItems: orderState,
      totalPayment: Number(grandTotal),
      status: "pending"
    }
    try {
      axiosInstance.post("/tickets/newticket", ticket)
    }
    catch (err) {
      console.log("Unable to Post Ticket", err)
    }
  }
  //Handler for pay button that creates a ticket in MongoDB and resets the price screen.
  function handlePayment() {
    postOrder()
    setOrders([])
    setTotal("0.00")
    setTax("0.00")
    setGrandTotal("0.00")
  }

  function handleClear() {
    setOrders([])
    setTotal("0.00")
    setTax("0.00")
    setGrandTotal("0.00")
  }

  return (

    <div className={styles.pagewrapper}>
      <div className={styles.order}>
        <h1>Order</h1>
        <ul className={styles.orderitems}>
          {orderState.map((obj,index) => (
            <li key={index} className={styles.orderlistitem }>
              <p className={styles.itemname }>{obj.name}</p>
              <p className={styles.price}>${obj.price}</p>
            </li>
          )) }
        </ul>
        <h1>Total</h1>
        <div className={styles.totals}>
        <li>
          <h4>Total: </h4>
            <p>${totalState}</p>
          </li>
          <li>
          <h4>Tax: </h4>
            <p>${taxState}</p>
          </li>
          <li>
          <h4>Grand Total: </h4>
            <p>${grandTotal}</p>
          </li>
        </div>
      </div>
      <div className={styles.menu}>
        {loadingBool &&
          <div className={styles.loading}>
            {loadingCounter === 0 && <h1>Loading...</h1>}
            {loadingCounter === 1 && <h1>Loading.</h1>}
            {loadingCounter === 2 && <h1>Loading..</h1>}
            {loadingCounter === 3 && <h1>Loading...</h1>}
          </div>
        }
        {!loadingBool &&
          <div className={styles.menuselection}>
            <button onClick={() => handleEntree()}>Entree</button>
            <button onClick={() => handleSides()}>Sides</button>
            <button onClick={() => handleDrinks()}>Drinks</button>
            <button onClick={() => handleCombos()}>Combos</button>
          </div>}
        <div className={styles.menuitems}>
          {entreeBool && entreeRef.current.map((obj, index) => (
            <button onClick={() => addItem(obj)} key={index}>{obj.name}</button>
          ))}
          {sidesBool && sidesRef.current.map((obj, index) => (
            <button onClick={() => addItem(obj)} key={index}>{obj.name}</button>
          ))}
          {drinksBool && drinksRef.current.map((obj, index) => (
            <button onClick={() => addItem(obj)} key={index}>{obj.name}</button>
          ))}
          {combosBool && combosRef.current.map((obj, index) => (
            <button onClick={() => addItem(obj)} key={index}>{obj.name}</button>
          ))}
        </div>
        {!loadingBool &&
          <div>
          <button onClick={() => handlePayment()} className={styles.pay}>Pay</button>
          <button onClick={() => handleClear()} className={styles.pay}>Clear</button>
          </div>
        }
        {!loadingBool &&
          <div className={styles.ticketMenu}>
            <button><Link href="/currentOrders">Tickets</Link></button>
            <button><Link href="/history">History</Link></button>
          </div>}
      </div>
    </div>
  )
}

export default Home;
