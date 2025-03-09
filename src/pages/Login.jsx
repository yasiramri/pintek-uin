import LoginForm from '../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h4>Masuk</h4>
        <LoginForm />
      </div>
    </div>
  );
}
