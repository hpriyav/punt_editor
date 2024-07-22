document.addEventListener('DOMContentLoaded', () => {
    const fontFamilySelect = document.getElementById('font-family');
    const fontWeightSelect = document.getElementById('font-weight');
    const italicToggle = document.getElementById('italic-toggle');
    const editor = document.getElementById('editor');
    const resetButton = document.getElementById('reset-button');
    const saveButton = document.getElementById('save-button');

    const fontsData = {
       "Roboto": ["100", "100italic", "300", "300italic", "400", "400italic", "500", "500italic", "700", "700italic", "900", "900italic"],
       "Open Sans": ["300", "300italic", "400", "400italic", "600", "600italic", "700", "700italic", "800", "800italic"],
       "Lato": ["100", "100italic", "300", "300italic", "400", "400italic", "700", "700italic", "900", "900italic"],
       "Arial": ["400", "400italic", "700", "700italic"],
       "Verdana": ["400", "400italic", "700", "700italic"],
       "Georgia": ["400", "400italic", "700", "700italic"],
       "Times New Roman": ["400", "400italic", "700", "700italic"],
       "Courier New": ["400", "400italic", "700", "700italic"],
       "Tahoma": ["400", "400italic", "700", "700italic"],
       "Trebuchet MS": ["400", "400italic", "700", "700italic"],
       "Comic Sans MS": ["400", "400italic", "700", "700italic"],
       "Poppins": ["100", "100italic", "200", "200italic", "300", "300italic", "400", "400italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
       "Montserrat": ["100", "100italic", "200", "200italic", "300", "300italic", "400", "400italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
       "Nunito": ["200", "300", "400", "600", "700", "800"],
       "Merriweather": ["300", "300italic", "400", "400italic", "700", "700italic", "900", "900italic"],
       "Raleway": ["100", "100italic", "200", "200italic", "300", "300italic", "400", "400italic", "500", "500italic", "600", "600italic", "700", "700italic", "800", "800italic", "900", "900italic"],
       "Source Sans Pro": ["200", "300", "400", "600", "700"],
       "Oxygen": ["300", "400", "700"],
       "Quicksand": ["300", "400", "700"],
    };

    function populateFontFamilies() {
        fontFamilySelect.innerHTML = '';
        for (let font in fontsData) {
            let option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontFamilySelect.appendChild(option);
        }
        fontFamilySelect.addEventListener('change', onFontFamilyChange);
        onFontFamilyChange();
    }

    function onFontFamilyChange() {
        const selectedFont = fontFamilySelect.value;
        const variants = fontsData[selectedFont] || [];
        populateFontWeights(variants);

     
        const currentWeight = fontWeightSelect.value;
        const isItalic = italicToggle.checked;
        const closestVariant = findClosestVariant(variants, currentWeight, isItalic);
        const [weight, style] = closestVariant.includes('italic') ? [closestVariant.replace('italic', ''), 'italic'] : [closestVariant, 'normal'];

        fontWeightSelect.value = weight;
        italicToggle.checked = style === 'italic';

        applyFont();
    }

    function populateFontWeights(variants) {
        fontWeightSelect.innerHTML = '';
        const weights = Array.from(new Set(variants.map(v => parseInt(v.match(/\d+/)))));
        weights.forEach(weight => {
            let option = document.createElement('option');
            option.value = weight;
            option.textContent = weight;
            fontWeightSelect.appendChild(option);
        });
        fontWeightSelect.addEventListener('change', onFontWeightChange);
        onFontWeightChange();
    }

    function onFontWeightChange() {
        const selectedFont = fontFamilySelect.value;
        const selectedWeight = fontWeightSelect.value;
        const variants = fontsData[selectedFont] || [];

        const italicVariants = variants.filter(v => v.includes(`${selectedWeight}italic`));
        italicToggle.disabled = italicVariants.length === 0;
        italicToggle.checked = !italicToggle.disabled && italicToggle.checked;

        applyFont();
    }

    italicToggle.addEventListener('change', applyFont);

    function applyFont() {
        const selectedFont = fontFamilySelect.value;
        const selectedWeight = fontWeightSelect.value;
        const isItalic = italicToggle.checked ? 'italic' : 'normal';

        editor.style.fontFamily = selectedFont;
        editor.style.fontWeight = selectedWeight;
        editor.style.fontStyle = isItalic;

        autoSave();
    }

    function validateAndApplyData(data) {
        let validFontFamily = fontsData.hasOwnProperty(data.fontFamily) ? data.fontFamily : 'Roboto';
        let validVariants = fontsData[validFontFamily];
        let validFontWeight = validVariants.some(v => v.includes(data.fontWeight)) ? data.fontWeight : '400';
        let validItalic = validVariants.includes(`${validFontWeight}italic`) ? data.isItalic : false;

        fontFamilySelect.value = validFontFamily;
        populateFontWeights(validVariants);
        fontWeightSelect.value = validFontWeight;
        italicToggle.checked = validItalic;

        applyFont();
    }

    function autoSave() {
        const data = {
            text: editor.value,
            fontFamily: fontFamilySelect.value,
            fontWeight: fontWeightSelect.value,
            isItalic: italicToggle.checked
        };
        localStorage.setItem('editorData', JSON.stringify(data));
    }

    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('editorData'));
        if (savedData) {
            editor.value = savedData.text;
            validateAndApplyData(savedData);
        } else {
            fontFamilySelect.value = 'Roboto';
            onFontFamilyChange();
            fontWeightSelect.value = '400';
            italicToggle.checked = false;
            applyFont();
        }
    }
    function applyFontPreview() {
        const selectedFont = fontFamilySelect.value;
        const selectedWeight = fontWeightSelect.value;
        const isItalic = italicToggle.checked ? 'italic' : 'normal';
    
        editor.style.fontFamily = selectedFont;
        editor.style.fontWeight = selectedWeight;
        editor.style.fontStyle = isItalic;
    
        // Preview the selected font in a temporary element
        const previewElement = document.getElementById('font-preview');
        previewElement.style.fontFamily = selectedFont;
        previewElement.style.fontWeight = selectedWeight;
        previewElement.style.fontStyle = isItalic;
        previewElement.textContent = `Preview: The quick brown fox jumps over the lazy dog.`;
    }
    
    // Call applyFontPreview when font options change
    fontFamilySelect.addEventListener('change', () => {
        onFontFamilyChange();
        applyFontPreview();
    });
    fontWeightSelect.addEventListener('change', () => {
        onFontWeightChange();
        applyFontPreview();
    });
    italicToggle.addEventListener('change', () => {
        applyFont();
        applyFontPreview();
    });

    function resetEditor() {
        editor.value = '';
        fontFamilySelect.value = 'Roboto';
        onFontFamilyChange();
        fontWeightSelect.value = '400';
        italicToggle.checked = false;
        applyFont();
    }

    function findClosestVariant(variants, currentWeight, isItalic) {
        
        const italicVariants = variants.filter(v => v.includes('italic'));
        const nonItalicVariants = variants.filter(v => !v.includes('italic'));

     
        const extractWeights = (variants) => Array.from(new Set(variants.map(v => parseInt(v.match(/\d+/)))));
        const italicWeights = extractWeights(italicVariants);
        const nonItalicWeights = extractWeights(nonItalicVariants);

       
        const findClosestWeight = (weights, target) => {
            let closest = weights[0];
            let minDiff = Math.abs(target - closest);
            for (const weight of weights) {
                const diff = Math.abs(target - weight);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = weight;
                }
            }
            return closest;
        };
        if (isItalic) {
            if (italicWeights.length > 0) {
            
                const closestItalicWeight = findClosestWeight(italicWeights, currentWeight);
                return `${closestItalicWeight}italic`;
            } else {
                
                const closestNonItalicWeight = findClosestWeight(nonItalicWeights, currentWeight);
                return `${closestNonItalicWeight}`;
            }
        } else {
           
            if (nonItalicWeights.length > 0) {
                const closestNonItalicWeight = findClosestWeight(nonItalicWeights, currentWeight);
                return `${closestNonItalicWeight}`;
            } else {
               
                return italicWeights.length > 0 ? `${findClosestWeight(italicWeights, currentWeight)}italic` : `${findClosestWeight(nonItalicWeights, currentWeight)}`;
            }
        }
    }

    resetButton.addEventListener('click', resetEditor);
    //saveButton.addEventListener('click', autoSave);
    saveButton.addEventListener('click',()=>{
        autoSave();
        alert('Content saved!!!');
    });
    
    editor.addEventListener('input', autoSave);

    populateFontFamilies();
    loadSavedData();
});
