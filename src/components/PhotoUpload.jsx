export default function PhotoUpload({ setPhoto }) {
  const handlePhotoUpload = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={handlePhotoUpload} />
    </div>
  );
}
