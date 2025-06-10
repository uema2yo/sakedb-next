import { SITE_TITLE } from "@/constants";

const Footer = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 w-full text-center text-gray-500 text-sm p-4 bg-white border-t border-secondary/33">
      <div className="container grid grid-cols-4 gap-4 mx-auto">
        <p className="mb-2">
          Powered by <a href=""></a>
          <span className="text-primary">{SITE_TITLE}</span>
        </p>
        <p className="mb-2">
          Developed by <a href=""> </a>
          <span className="text-primary">Your Name</span>
        </p>
        <p className="mb-2">
          Contact: <a href="mailto:   "></a>
          <span className="text-primary"> </span>
        </p>
        <p className="mb-2">
          Follow us on <a href=""></a>
          <span className="text-primary">Social Media</span>
        </p>
        <p className="mb-2">
          For more information, visit our <a href=""></a>
          <small>&copy; </small>
          <span className="text-primary">Website</span>
        </p>
        <p className="mb-2">All rights reserved.</p>
        <p className="mb-2">
          Last updated: <span className="text-primary">October 2023</span>
        </p>
        <p className="mb-2">Terms of Service | Privacy Policy</p>
      </div>
    </footer>
  );
};

export default Footer;
