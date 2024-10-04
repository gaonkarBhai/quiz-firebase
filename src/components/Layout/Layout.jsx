import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";
const Layout = ({ children, description, keyword, author, title }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />
      <main>
        <Toaster />
        {children}
      </main>
      <Footer />
    </>
  );
};

Layout.defaultProps = {
  title: "Browse 2024",
  description: "Quiz 2024",
  keyword: "browse, sit, sark",
  author: "Dhanush, Naveen",
};

export default Layout;
