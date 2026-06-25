import { Link } from 'react-router-dom'

export default function CallToAction({ heading, subtext, buttonText, to, icon = 'fas fa-paper-plane' }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-purple-600 rounded-2xl shadow-xl p-10 md:p-14 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
      {subtext && <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">{subtext}</p>}
      <Link
        to={to}
        className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold text-lg transition-transform hover:scale-105"
      >
        <i className={icon}></i> {buttonText}
      </Link>
    </div>
  )
}
