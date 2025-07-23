const translateText = async (text, targetLang) => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0].map(item => item[0]).join('');
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};


const translateObject = async (obj, targetLang) => {
  if (!obj) return obj;
  
  const translatedObj = { ...obj };
  const textFields = ['title', 'content', 'summary', 'excerpt', 'category'];
  
  for (const field of textFields) {
    if (translatedObj[field]) {
      translatedObj[field] = await translateText(translatedObj[field], targetLang);
    }
  }
  

  if (translatedObj.tags && Array.isArray(translatedObj.tags)) {
    translatedObj.tags = await Promise.all(
      translatedObj.tags.map(tag => translateText(tag, targetLang))
    );
  }
  
  return translatedObj;
};

export { translateText, translateObject };
