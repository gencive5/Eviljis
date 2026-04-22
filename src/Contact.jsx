import './App.css';

const Contact = () => (
  <footer className="footer">

     <a
      href="mailto:contact@genciv.es"
      className="mx-2 underline hover:opacity-80 transition-opacity"
      style={{ color: '#0084ff' }}
    >
      email
    </a>
  
    <a
      href="https://instagram.com/gencive5"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#ffffffff' }}
    >
      instagram
    </a>
  </footer>
);

export default Contact;