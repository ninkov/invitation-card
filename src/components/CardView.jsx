export default function CardView({ photo, text, setText ,background}) {
  return (
    
    <div id="card" className="card"style={{backgroundImage: `url(${background})`,backgroundSize: '100% 100%'}}>
    
      {photo && (
        <div className="frame">
          <img src={photo} alt="Uploaded" className="photo" />
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="text"
      ></textarea>
    </div>
  );
}