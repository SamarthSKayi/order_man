import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [customer, setCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);

  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "CUST-001",
      amount: 4500,
      date: "07 Sep 2026",
      status: "CONFIRMED",
    },
    {
      id: "ORD-1002",
      customer: "CUST-002",
      amount: 2300,
      date: "07 Sep 2026",
      status: "PROCESSING",
    },
    {
      id: "ORD-1003",
      customer: "CUST-003",
      amount: 8200,
      date: "06 Sep 2026",
      status: "DELIVERED",
    },
    {
      id: "ORD-1004",
      customer: "CUST-004",
      amount: 1750,
      date: "06 Sep 2026",
      status: "PENDING",
    },
  ]);

  const customers = [
    {
      id: 1,
      code: "CUST-001",
      name: "Rahul Sharma",
    },
    {
      id: 2,
      code: "CUST-002",
      name: "Priya Singh",
    },
    {
      id: 3,
      code: "CUST-003",
      name: "Amit Kumar",
    },
  ];

  const products = [
    {
      id: 1,
      code: "PROD-001",
      name: "Wireless Keyboard",
      price: 2499,
      stock: 100,
    },
    {
      id: 2,
      code: "PROD-002",
      name: "Wireless Mouse",
      price: 1499,
      stock: 75,
    },
    {
      id: 3,
      code: "PROD-003",
      name: "USB-C Hub",
      price: 1999,
      stock: 50,
    },
  ];

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: "📦",
    },
    {
      title: "Pending Orders",
      value: orders.filter(
        (order) => order.status === "PENDING"
      ).length,
      icon: "⏳",
    },
    {
      title: "Processing",
      value: orders.filter(
        (order) => order.status === "PROCESSING"
      ).length,
      icon: "⚙️",
    },
    {
      title: "Delivered",
      value: orders.filter(
        (order) => order.status === "DELIVERED"
      ).length,
      icon: "✓",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const addProduct = () => {
    if (!selectedProduct || Number(quantity) <= 0) {
      return;
    }

    const product = products.find(
      (product) =>
        product.id === Number(selectedProduct)
    );

    if (!product) {
      return;
    }

    const existingItem = orderItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + Number(quantity),
              }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          product,
          quantity: Number(quantity),
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeProduct = (productId) => {
    setOrderItems(
      orderItems.filter(
        (item) => item.product.id !== productId
      )
    );
  };

  const orderTotal = orderItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  const closeCreateOrder = () => {
    setShowCreateOrder(false);
    setCustomer("");
    setSelectedProduct("");
    setQuantity(1);
    setOrderItems([]);
  };

  const createOrder = () => {
    if (!customer || orderItems.length === 0) {
      return;
    }

    const customerData = customers.find(
      (item) => item.id === Number(customer)
    );

    if (!customerData) {
      return;
    }

    const nextOrderNumber = 1001 + orders.length;

    const newOrder = {
      id: `ORD-${nextOrderNumber}`,
      customer: customerData.code,
      amount: orderTotal,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "PENDING",
    };

    setOrders((previousOrders) => [
      newOrder,
      ...previousOrders,
    ]);

    closeCreateOrder();
    setActivePage("Orders");
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          Order Management
        </div>

        <nav>
          {[
            "Dashboard",
            "Orders",
            "Products",
            "Customers",
          ].map((item) => (
            <div
              key={item}
              className={`nav-item ${
                activePage === item ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item);
                setShowCreateOrder(false);
              }}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Header */}
        <header className="header">
          <h1>{activePage}</h1>
          <div className="user">
            Admin User
          </div>
        </header>

        <section className="dashboard">

          {/* ================= Dashboard ================= */}

          {activePage === "Dashboard" && (
            <>
              <div className="welcome">
                <h2>
                  Enterprise Order Management
                </h2>

                <p>
                  Manage customer orders and monitor
                  order processing.
                </p>
              </div>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <div
                    className="stat-card"
                    key={stat.title}
                  >
                    <div className="stat-card-header">
                      <p>{stat.title}</p>

                      <span className="stat-icon">
                        {stat.icon}
                      </span>
                    </div>

                    <h2>{stat.value}</h2>
                  </div>
                ))}
              </div>

              <div className="orders-section">
                <div className="section-header">
                  <h2>Recent Orders</h2>

                  <button
                    onClick={() =>
                      setActivePage("Orders")
                    }
                  >
                    View All
                  </button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders
                        .slice(0, 4)
                        .map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>

                            <td>
                              {order.customer}
                            </td>

                            <td>
                              ₹
                              {order.amount.toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>{order.date}</td>

                            <td>
                              <span
                                className={`status ${order.status.toLowerCase()}`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ================= Orders ================= */}

          {activePage === "Orders" && (
            <div className="orders-page">

              {!showCreateOrder ? (
                <>
                  <div className="page-header">
                    <div>
                      <h2>Orders</h2>

                      <p>
                        View and manage customer
                        orders.
                      </p>
                    </div>

                    <button
                      className="primary-button"
                      onClick={() =>
                        setShowCreateOrder(true)
                      }
                    >
                      + Create Order
                    </button>
                  </div>

                  <div className="order-filters">
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) =>
                        setSearchTerm(e.target.value)
                      }
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value)
                      }
                    >
                      <option value="ALL">
                        All Statuses
                      </option>

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="CONFIRMED">
                        Confirmed
                      </option>

                      <option value="PROCESSING">
                        Processing
                      </option>

                      <option value="SHIPPED">
                        Shipped
                      </option>

                      <option value="DELIVERED">
                        Delivered
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  <div className="orders-section">
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredOrders.length > 0 ? (
                            filteredOrders.map(
                              (order) => (
                                <tr key={order.id}>
                                  <td>{order.id}</td>

                                  <td>
                                    {order.customer}
                                  </td>

                                  <td>
                                    ₹
                                    {order.amount.toLocaleString(
                                      "en-IN"
                                    )}
                                  </td>

                                  <td>
                                    {order.date}
                                  </td>

                                  <td>
                                    <span
                                      className={`status ${order.status.toLowerCase()}`}
                                    >
                                      {order.status}
                                    </span>
                                  </td>

                                  <td>
                                    <button className="view-button">
                                      View
                                    </button>
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="empty-state"
                              >
                                No orders found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (

                /* ================= Create Order ================= */

                <div className="create-order">

                  <div className="form-header">
                    <div>
                      <h2>
                        Create New Order
                      </h2>

                      <p>
                        Create an order for a
                        customer.
                      </p>
                    </div>

                    <button
                      className="close-button"
                      onClick={closeCreateOrder}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Customer */}

                  <div className="form-section">
                    <h3>
                      Customer Information
                    </h3>

                    <label>
                      Customer
                    </label>

                    <select
                      value={customer}
                      onChange={(e) =>
                        setCustomer(e.target.value)
                      }
                    >
                      <option value="">
                        Select customer
                      </option>

                      {customers.map(
                        (customer) => (
                          <option
                            key={customer.id}
                            value={customer.id}
                          >
                            {customer.code} —{" "}
                            {customer.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Products */}

                  <div className="form-section">
                    <h3>Order Items</h3>

                    <div className="product-row">

                      <div>
                        <label>
                          Product
                        </label>

                        <select
                          value={selectedProduct}
                          onChange={(e) =>
                            setSelectedProduct(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Select product
                          </option>

                          {products.map(
                            (product) => (
                              <option
                                key={product.id}
                                value={product.id}
                              >
                                {product.code} —{" "}
                                {product.name} — ₹
                                {product.price.toLocaleString(
                                  "en-IN"
                                )}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="quantity-field">
                        <label>
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <button
                        className="add-item-button"
                        onClick={addProduct}
                      >
                        + Add Item
                      </button>

                    </div>

                    {/* Selected Products */}

                    {orderItems.length > 0 && (
                      <div className="selected-items">

                        {orderItems.map((item) => (
                          <div
                            className="selected-item"
                            key={item.product.id}
                          >
                            <div>
                              <strong>
                                {item.product.name}
                              </strong>

                              <span>
                                ₹
                                {item.product.price.toLocaleString(
                                  "en-IN"
                                )}{" "}
                                × {item.quantity}
                              </span>
                            </div>

                            <div className="item-right">

                              <strong>
                                ₹
                                {(
                                  item.product.price *
                                  item.quantity
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </strong>

                              <button
                                onClick={() =>
                                  removeProduct(
                                    item.product.id
                                  )
                                }
                              >
                                Remove
                              </button>

                            </div>
                          </div>
                        ))}

                      </div>
                    )}
                  </div>

                  {/* Summary */}

                  <div className="order-summary">

                    <div>
                      <span>
                        Total Items
                      </span>

                      <strong>
                        {orderItems.reduce(
                          (total, item) =>
                            total +
                            item.quantity,
                          0
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Amount
                      </span>

                      <strong>
                        ₹
                        {orderTotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                  </div>

                  {/* Actions */}

                  <div className="form-actions">

                    <button
                      className="secondary-button"
                      onClick={closeCreateOrder}
                    >
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      disabled={
                        !customer ||
                        orderItems.length === 0
                      }
                      onClick={createOrder}
                    >
                      Create Order
                    </button>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* ================= Products ================= */}

          {activePage === "Products" && (
            <div className="page-content">
              <h2>Products</h2>

              <p>
                Manage products and inventory.
              </p>
            </div>
          )}

          {/* ================= Customers ================= */}

          {activePage === "Customers" && (
            <div className="page-content">
              <h2>Customers</h2>

              <p>
                Manage customer information.
              </p>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default App;