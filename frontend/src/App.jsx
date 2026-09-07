import "./App.css";

function App() {
  const stats = [
    {
      title: "Total Orders",
      value: 128,
    },
    {
      title: "Pending Orders",
      value: 24,
    },
    {
      title: "Processing",
      value: 13,
    },
    {
      title: "Delivered",
      value: 91,
    },
  ];

  const orders = [
    {
      id: "ORD-1001",
      customer: "CUST-001",
      amount: "₹4,500",
      date: "07 Sep 2026",
      status: "CONFIRMED",
    },
    {
      id: "ORD-1002",
      customer: "CUST-002",
      amount: "₹2,300",
      date: "07 Sep 2026",
      status: "PROCESSING",
    },
    {
      id: "ORD-1003",
      customer: "CUST-003",
      amount: "₹8,200",
      date: "06 Sep 2026",
      status: "DELIVERED",
    },
    {
      id: "ORD-1004",
      customer: "CUST-004",
      amount: "₹1,750",
      date: "06 Sep 2026",
      status: "PENDING",
    },
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Order Management</div>

        <nav>
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Orders</div>
          <div className="nav-item">Products</div>
          <div className="nav-item">Customers</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Dashboard</h1>
          <div className="user">Admin User</div>
        </header>

        {/* Dashboard */}
        <section className="dashboard">
          <div className="welcome">
            <h2>Enterprise Order Management</h2>
            <p>
              Manage customer orders and monitor order processing.
            </p>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.title}>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="orders-section">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <button>View All</button>
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
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.amount}</td>
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
        </section>
      </main>
    </div>
  );
}

export default App;