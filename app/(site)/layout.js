import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Grain from '../../components/Grain';
import CustomCursor from '../../components/CustomCursor';

export default function SiteLayout({ children }) {
  return (
    <>
      <Grain />
      <CustomCursor />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
