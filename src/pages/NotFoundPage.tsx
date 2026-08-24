import { Link, useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontSize: '8rem', margin: 0, color: '#646cff' }}>404</div>
      <h2>页面未找到</h2>
      <p className="info-text" style={{ marginBottom: '2rem' }}>
        抱歉，您访问的页面不存在
      </p>
      <Link to="/">
        <button className="primary">🏠 返回首页</button>
      </Link>
      <button onClick={() => navigate(-1)}>⬅️ 返回上一页</button>
    </div>
  )
}

export default NotFoundPage
