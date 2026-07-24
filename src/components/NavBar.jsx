import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  marginRight: 16,
  textDecoration: 'none',
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? '#5a3b2e' : '#374151',
});

function NavBar() {
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
    </nav>
  );
}

export default NavBar;
