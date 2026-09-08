import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const books = [
  {
    id: 1,
    title: 'Гарри Поттер и философский камень',
    author: 'Дж. К. Роулинг',
    rating: 4.8,
    description:
      'Первый роман в серии о юном волшебнике, который узнаёт о своём даре и поступает в школу магии Хогвартс.',
    price: 499,
    coverColor: '#8B0000',
    coverText: 'Гарри Поттер',
  },
  {
    id: 2,
    title: 'Властелин колец: Братство кольца',
    author: 'Дж. Р. Р. Толкин',
    rating: 4.9,
    description:
      'Хоббит Фродо отправляется в опасное путешествие, чтобы уничтожить Кольцо Всевластья и спасти Средиземье.',
    price: 599,
    coverColor: '#2E4A62',
    coverText: 'Властелин колец',
  },
  {
    id: 3,
    title: '1984',
    author: 'Джордж Оруэлл',
    rating: 4.7,
    description:
      'Антиутопия о тоталитарном обществе, где власть контролирует мысли и историю, а главный герой начинает сомневаться в системе.',
    price: 349,
    coverColor: '#4A4A4A',
    coverText: '1984',
  },
  {
    id: 4,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    rating: 4.9,
    description:
      'Роман о визите дьявола в Москву 1930-х годов, переплетающий мистику, философию и историю Понтия Пилата.',
    price: 450,
    coverColor: '#5D3A1A',
    coverText: 'Мастер и Маргарита',
  },
  {
    id: 5,
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    rating: 4.6,
    description:
      'Философская сказка о маленьком принце, который путешествует по планетам и учит главным жизненным истинам.',
    price: 299,
    coverColor: '#2E8B57',
    coverText: 'Маленький принц',
  },
];

function BookCard({book}) {
  return (
    <div className="book-card">
      <div className="book-cover" style={{backgroundColor: book.coverColor}}>
        <span className="cover-text">{book.coverText}</span>
      </div>
      <div className="book-info">
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>
        <div className="book-rating">
          <span className="stars">{'★'.repeat(Math.round(book.rating))}</span>
          <span className="rating-value">{book.rating.toFixed(1)}</span>
        </div>
        <p className="book-description">{book.description}</p>
        <p className="book-price">{book.price} ₽</p>
      </div>
    </div>
  );
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = books.length;

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <main data-testid="app" className="app">
      <h1 className="slider-title" data-testid="slide-page">
        Популярные книги
      </h1>
      <div className="slider-container" data-testid="slide-page">
        <button
          className="slider-button prev"
          data-testid="slide-previous"
          onClick={goToPrev}
          aria-label="Предыдущий слайд"
        >
          {'<'}
        </button>

        <div className="slide-wrapper" data-testid="slide-page">
          <BookCard book={books[currentSlide]} />
        </div>

        <button
          className="slider-button next"
          data-testid="slide-next"
          onClick={goToNext}
          aria-label="Следующий слайд"
        >
          {'>'}
        </button>
      </div>

      <div className="slider-footer">
        <div className="slide-counter" data-testid="slide-indicator">
          {currentSlide + 1}/{totalSlides}
        </div>
        <div className="pagination" data-testid="book-slide">
          {books.map((book, index) => (
            <button
              key={book.id}
              className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
