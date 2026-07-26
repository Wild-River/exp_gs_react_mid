import { NavLink, useLocation } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  marginRight: 16,
  textDecoration: 'none',
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? '#5a3b2e' : '#374151',
});

function NavBar() {
  const location = useLocation();
  return (
    <nav
      style={{
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: 12,
        marginBottom: 20,
      }}
    >
      <NavLink to='/' style={linkStyle}>
        ダッシュボード
      </NavLink>
      <NavLink to='/generate' style={linkStyle}>
        生成する
      </NavLink>
      {location.pathname.startsWith('/edit/') ? (
        <NavLink to={location.pathname} style={linkStyle}>
          コンテンツを編集
        </NavLink>
      ) : (
        ''
      )}
    </nav>
  );
}

export default NavBar;
