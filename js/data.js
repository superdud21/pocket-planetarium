export function saveFavorite(apodItem) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favorites.find(item => item.date === apodItem.date)) {
    favorites.push(apodItem);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem('favorites')) || [];
}
