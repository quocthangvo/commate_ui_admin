export default function MainLayout({ children }) {
  return (
    <div className="auth-container">
      <div className="container">{children}</div>
    </div>
  );
}
