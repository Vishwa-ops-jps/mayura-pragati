import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/adminApi';
import { formatCurrency, formatDate, StatusPill } from '../utils';
import { DonutChart, StockTrendChart, GaugeChart, MultiLineChart, PieChart } from '../components/Charts';

const monthLabel = (ym) => {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setSummary(await dashboardApi.summary());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;
  if (!summary) return null;

  const maxTrend = Math.max(1, ...summary.revenueTrend.map((r) => r.revenue));
  const completionPct = summary.totalOrders ? (summary.deliveredOrders / summary.totalOrders) * 100 : 0;
  const cancelPct = summary.totalOrders ? (summary.cancelledOrders / summary.totalOrders) * 100 : 0;
  const monthlyStats = (summary.monthlyRevenue || []).map((m) => ({ ...m, label: monthLabel(m.month) }));

  return (
    <section>
      {/* Total Sales / Total Orders / Order Complete / Cancel Order */}
      <div className="hero-stats">
        <div className="hero-card">
          <span className="stat-icon gold">⛁</span>
          <span className="hero-label">Total Sales</span>
          <strong>{formatCurrency(summary.totalRevenue)}</strong>
          <span className="hero-change up">▲ All-time revenue</span>
        </div>
        <div className="hero-card">
          <span className="stat-icon teal">▤</span>
          <span className="hero-label">Total Orders</span>
          <strong>{summary.totalOrders}</strong>
          <span className="hero-change up">{summary.pendingOrders}<small>pending</small></span>
        </div>
        <div className="hero-card">
          <span className="stat-icon green">✓</span>
          <span className="hero-label">Order Complete</span>
          <strong>{summary.deliveredOrders}</strong>
          <span className="hero-change up">▲ {completionPct.toFixed(1)}%<small>vs total</small></span>
        </div>
        <div className="hero-card">
          <span className="stat-icon red">✕</span>
          <span className="hero-label">Cancel Order</span>
          <strong>{summary.cancelledOrders}</strong>
          <span className="hero-change down">▲ {cancelPct.toFixed(1)}%<small>vs total</small></span>
        </div>
      </div>

      {/* Target (order-completion gauge) + Statistic (revenue vs orders trend) */}
      <div className="dashboard-grid target-statistic-grid">
        <div className="admin-panel-card">
          <div className="panel-heading"><div><span>ORDER COMPLETION</span><h2>Target</h2></div></div>
          <GaugeChart percent={completionPct} />
          <p className="gauge-caption">
            <strong>{summary.deliveredOrders}</strong> of <strong>{summary.totalOrders}</strong> orders delivered
          </p>
          <div className="gauge-breakdown">
            <div><span>Total</span><strong>{summary.totalOrders}</strong></div>
            <div><span>Delivered</span><strong>{summary.deliveredOrders}</strong></div>
            <div><span>Pending</span><strong>{summary.pendingOrders}</strong></div>
          </div>
        </div>
        <div className="admin-panel-card">
          <div className="panel-heading"><div><span>LAST 6 MONTHS</span><h2>Statistic</h2></div></div>
          <MultiLineChart data={monthlyStats} />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-icon purple">♙</span><span>Customers</span><strong>{summary.totalCustomers}</strong><em>Registered buyers</em></div>
        <div className="stat-card"><span className="stat-icon gold">◇</span><span>Products</span><strong>{summary.totalProducts}</strong><em>{summary.outOfStock} out of stock</em></div>
        <div className="stat-card"><span className="stat-icon red">⚠</span><span>Low Stock</span><strong>{summary.lowStock}</strong><em>Needs restock</em></div>
        <div className="stat-card"><span className="stat-icon gold">%</span><span>Active Coupons</span><strong>{summary.activeCoupons || 0}</strong><em>Currently running</em></div>
        <div className="stat-card"><span className="stat-icon teal">✎</span><span>Pending Reviews</span><strong>{summary.pendingReviews || 0}</strong><em>Awaiting moderation</em></div>
        <div className="stat-card"><span className="stat-icon green">★</span><span>Avg Rating</span><strong>{Number(summary.avgRating).toFixed(1)}</strong><em>Across catalogue</em></div>
      </div>

      <div className="dashboard-grid">
        <div className="admin-panel-card chart-card">
          <div className="panel-heading"><div><span>LAST 7 DAYS</span><h2>Revenue trend</h2></div><button onClick={() => navigate('/admin/reports')}>Full report →</button></div>
          {summary.revenueTrend.length ? (
            <div className="activity-bars">
              {summary.revenueTrend.map((row) => (
                <div key={row.date} className="activity-col">
                  <div style={{ height: `${Math.max((row.revenue / maxTrend) * 100, 6)}%` }} title={formatCurrency(row.revenue)} />
                  <small>{formatDate(row.date)}</small>
                </div>
              ))}
            </div>
          ) : <div className="empty-table">No orders yet.</div>}
        </div>
        <div className="admin-panel-card quick-card">
          <div className="panel-heading"><div><span>QUICK ACTIONS</span><h2>Store controls</h2></div></div>
          <button onClick={() => navigate('/admin/products')}>＋ Add New Product</button>
          <button onClick={() => navigate('/admin/orders')}>▤ Manage Orders</button>
          <button onClick={() => navigate('/admin/offers')}>% Create Offer</button>
          <button onClick={() => navigate('/admin/inventory')}>▥ Check Inventory</button>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-charts dashboard-grid-charts-3">
        <div className="admin-panel-card table-card">
          <div className="panel-heading"><div><span>CATEGORY SPLIT</span><h2>Sales by category</h2></div></div>
          <DonutChart data={summary.categoryBreakdown || []} />
        </div>
        <div className="admin-panel-card table-card">
          <div className="panel-heading"><div><span>ORDER MIX</span><h2>Orders by status</h2></div></div>
          <PieChart
            data={[
              { label: 'Delivered', value: summary.deliveredOrders, color: '#1F8A4C' },
              { label: 'Pending', value: summary.pendingOrders, color: '#C9A227' },
              { label: 'Processing', value: Math.max(summary.totalOrders - summary.deliveredOrders - summary.pendingOrders - summary.cancelledOrders, 0), color: '#B98B56' },
              { label: 'Cancelled', value: summary.cancelledOrders, color: '#7A1F2B' },
            ]}
          />
        </div>
        <div className="admin-panel-card table-card">
          <div className="panel-heading"><div><span>LAST 6 MONTHS</span><h2>Monthly revenue</h2></div></div>
          <StockTrendChart data={(summary.monthlyRevenue || []).map((m) => ({ ...m, label: monthLabel(m.month) }))} />
        </div>
      </div>

      <div className="admin-panel-card table-card">
        <div className="panel-heading"><div><span>RECENT ORDERS</span><h2>Latest activity</h2></div><button onClick={() => navigate('/admin/orders')}>View all</button></div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>ORDER</th><th>CUSTOMER</th><th>TOTAL</th><th>STATUS</th><th>PAYMENT</th><th>DATE</th></tr></thead>
            <tbody>
              {summary.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.customerName}</td>
                  <td>{formatCurrency(o.total)}</td>
                  <td><StatusPill value={o.orderStatus} /></td>
                  <td><StatusPill value={o.paymentStatus} /></td>
                  <td>{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!summary.recentOrders.length && <div className="empty-table">No orders yet.</div>}
        </div>
      </div>

      {summary.topProducts.length > 0 && (
        <div className="admin-panel-card table-card">
          <div className="panel-heading"><div><span>BEST SELLERS</span><h2>Top products</h2></div></div>
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>PRODUCT</th><th>UNITS SOLD</th><th>REVENUE</th></tr></thead>
              <tbody>
                {summary.topProducts.map((p) => (
                  <tr key={p.name}><td>{p.name}</td><td>{p.unitsSold}</td><td>{formatCurrency(p.revenue)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
