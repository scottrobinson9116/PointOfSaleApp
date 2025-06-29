"use client"

import { useEffect, useState } from "react"
import styles from "./page.module.css"
import Link from 'next/link'
import axios from 'axios'
import https from "https"

//Establishes a connection with the backend Node.js server
const axiosInstance = axios.create({
  baseURL: 'http://localhost:2001',
  timeout: 10000,
  httpsAgent: new https.Agent({ keepAlive: true }),
  headers: {
    'Content-Type': 'application/json',
  },
});

const History: React.FC = () => {

  //State
  const [allTickets, setAllTickets] = useState<Ticket[]>([])
  const [popupBool, setPopupBool] = useState<boolean>(false)
  const [idState, setIdState] = useState<string>("")
  const [orderState, setOrderState] = useState<number>(0)
  const [dateState, setDateState] = useState<string>()
  const [itemState, setItemState] = useState<Item[]>([])
  const [totalState, setTotalState] = useState<number>(0)
  const [statusState, setStatusState] = useState<string>("")

  //Types for ticket objects and arrays
  type Ticket = {
    orderNumber: number;
    dateCreated: string;
    orderItems: Item[];
    totalPayment: number;
    status: string;
  }

  type Item = {
    name: string,
    price: number,
    type: string,
  }

  useEffect(() => {
    //Fetches every order in MongoDB
    async function getAllOrders(): Promise<void> {
      const { data: response } = await axiosInstance.get('/tickets/all');
      const pendingDataArr: Ticket[] = await response;
      setAllTickets(pendingDataArr);
    }
    getAllOrders()
  }, [])

  //Conditionally renders ticket info and buttons when a ticket is clicked
  function handlePopup(index: number): void {
    const selectedOrder = allTickets[index]
    setOrderState(selectedOrder.orderNumber)
    setDateState(selectedOrder.dateCreated)
    setItemState(selectedOrder.orderItems)
    setTotalState(selectedOrder.totalPayment)
    setStatusState(selectedOrder.status)
    setIdState(String(selectedOrder.orderNumber))
    setPopupBool(true)
  }
  //Set ticket as refund and removes it from currentOrders page
  async function refund(idState: string) {
    const { data: response } = await axiosInstance.patch('/tickets/status/refund', { idState });
    const pendingDataArr: Ticket[] = await response;
    setAllTickets(pendingDataArr)
    setStatusState("refund")
  }
  //Resets ticket to pending and becomes visible on currentOrders page
  async function remake(idState: string) {
    const { data: response } = await axiosInstance.patch('/tickets/status/pendingOrder', { idState });
    const pendingDataArr: Ticket[] = await response;
    setAllTickets(pendingDataArr)
    setStatusState("pending")
  }

  //Handles onClick for each ticket button
  function handleRefund(idState: string) {
    refund(idState)
  }
  function handleRemake(idState: string) {
    remake(idState)
  }

  return (
    <div className={styles.pagewrapper}>
      <div className={styles.header}>
      <h1>Order History</h1>
      <div className={styles.ticketmenu}>
        <button><Link href="/">Menu</Link></button>
        <button><Link href="/currentOrders">Tickets</Link></button>
        </div>
      </div>
    <div className={styles.orderlist}>
        {allTickets.map((obj, index) => (
          <button onClick={() => handlePopup(index)} key={index} ><div className={styles.order}>
          <p className={styles.boldtext}>Order: </p><p>{obj.orderNumber}</p>
          <p className={styles.boldtext}>Date: </p><p>{obj.dateCreated}</p>
          <p className={styles.boldtext}>Total: </p><p>${(obj.totalPayment).toFixed(2)}</p>
        </div></button>
      ))}
      </div>
      {popupBool &&
        <div className={styles.popup}>
          <div className={styles.popupcontent}>
            <h2>Order: {orderState}</h2>
            <h3>Date: </h3>
            <p>{dateState}</p>
            <h3>Items: </h3>
            <ul className={styles.itemslist }>
            {itemState.map((obj, index) => (
              <li key={index}>{obj.name}</li>
            ))}
            </ul>
            <h3>Total: </h3>
            <p>${(totalState).toFixed(2)}</p>
            <h3>Status: </h3>
            <p>{statusState}</p>
            <div className={styles.ticketbuttons}>
              <button onClick={() => handleRefund(idState) }>Refund</button>
              <button onClick={() => handleRemake(idState) }>Remake</button>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default History;