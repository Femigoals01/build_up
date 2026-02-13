export default function Footer() {
  return (
    <footer className="px-8 py-10 bg-gray-900 text-gray-300">
      <div className="grid md:grid-cols-3 gap-8">
        
        <div>
          <h4 className="font-bold text-white mb-3">BuildUp</h4>
          <p>A platform connecting volunteers, organizations, and expert mentors.</p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>Projects</li>
            <li>How it Works</li>
            <li>Become a Mentor</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3">Follow Us</h4>
          <p>Instagram • Twitter • LinkedIn</p>
        </div>

      </div>
    </footer>
  );
}
