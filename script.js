// DOM Elements
const qrType = document.getElementById('qrType');
const dynamicFields = document.getElementById('dynamicFields');
const generateBtn = document.getElementById('generateBtn');
const qrCode = document.getElementById('qrCode');
const qrColor = document.getElementById('qrColor');
const qrSize = document.getElementById('qrSize');
const dropZone = document.getElementById('dropZone');
const logoUpload = document.getElementById('logoUpload');
const downloadPNG = document.getElementById('downloadPNG');
const downloadSVG = document.getElementById('downloadSVG');
const downloadPDF = document.getElementById('downloadPDF');

// QR Code Generator instance
let qr = null;
let currentLogo = null;

// Dynamic form fields based on QR type
const formFields = {
    url: `
        <div id="urlFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="url">
                Website URL
            </label>
            <input type="url" id="url" class="w-full p-2 border rounded" placeholder="https://example.com">
        </div>
    `,
    text: `
        <div id="textFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="text">
                Text Message
            </label>
            <textarea id="text" class="w-full p-2 border rounded" rows="3" placeholder="Enter your text message"></textarea>
        </div>
    `,
    wifi: `
        <div id="wifiFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="ssid">
                WiFi Name (SSID)
            </label>
            <input type="text" id="ssid" class="w-full p-2 border rounded mb-2" placeholder="Enter WiFi name">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Password
            </label>
            <input type="password" id="password" class="w-full p-2 border rounded" placeholder="Enter WiFi password">
        </div>
    `,
    vcard: `
        <div id="vcardFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                Full Name
            </label>
            <input type="text" id="name" class="w-full p-2 border rounded mb-2" placeholder="Enter full name">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="phone">
                Phone Number
            </label>
            <input type="tel" id="phone" class="w-full p-2 border rounded mb-2" placeholder="Enter phone number">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
            </label>
            <input type="email" id="email" class="w-full p-2 border rounded" placeholder="Enter email address">
        </div>
    `,
    social: `
        <div id="socialFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="socialType">
                Social Media Platform
            </label>
            <select id="socialType" class="w-full p-2 border rounded mb-2">
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="whatsapp">WhatsApp</option>
            </select>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="socialUrl">
                Profile URL
            </label>
            <input type="url" id="socialUrl" class="w-full p-2 border rounded" placeholder="Enter profile URL">
        </div>
    `,
    email: `
        <div id="emailFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="emailAddress">
                Email Address
            </label>
            <input type="email" id="emailAddress" class="w-full p-2 border rounded mb-2" placeholder="Enter email address">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="emailSubject">
                Subject
            </label>
            <input type="text" id="emailSubject" class="w-full p-2 border rounded mb-2" placeholder="Enter email subject">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="emailBody">
                Message Body
            </label>
            <textarea id="emailBody" class="w-full p-2 border rounded" rows="3" placeholder="Enter email message"></textarea>
        </div>
    `,
    payment: `
        <div id="paymentFields">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="paymentType">
                Payment Platform
            </label>
            <select id="paymentType" class="w-full p-2 border rounded mb-2">
                <option value="upi">UPI</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
            </select>
            <label class="block text-gray-700 text-sm font-bold mb-2" for="paymentId">
                Payment ID/Username
            </label>
            <input type="text" id="paymentId" class="w-full p-2 border rounded" placeholder="Enter payment ID">
        </div>
    `
};

// Event Listeners
qrType.addEventListener('change', updateFormFields);
generateBtn.addEventListener('click', generateQRCode);
qrColor.addEventListener('input', updateQRCode);
qrSize.addEventListener('input', updateQRCode);
dropZone.addEventListener('click', () => logoUpload.click());
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('drop', handleDrop);
logoUpload.addEventListener('change', handleLogoUpload);
downloadPNG.addEventListener('click', () => downloadQRCode('png'));
downloadSVG.addEventListener('click', () => downloadQRCode('svg'));
downloadPDF.addEventListener('click', () => downloadQRCode('pdf'));
dropZone.addEventListener('dragleave', handleDragLeave);

// Functions
function updateFormFields() {
    const type = qrType.value;
    dynamicFields.innerHTML = formFields[type];
}

function generateQRCode() {
    const type = qrType.value;
    let data = '';

    switch (type) {
        case 'url':
            data = document.getElementById('url').value;
            break;
        case 'text':
            data = document.getElementById('text').value;
            break;
        case 'wifi':
            const ssid = document.getElementById('ssid').value;
            const password = document.getElementById('password').value;
            data = `WIFI:T:WPA;S:${ssid};P:${password};;`;
            break;
        case 'vcard':
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            data = `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
            break;
        case 'social':
            const socialType = document.getElementById('socialType').value;
            const socialUrl = document.getElementById('socialUrl').value;
            data = socialUrl;
            break;
        case 'email':
            const emailAddress = document.getElementById('emailAddress').value;
            const subject = document.getElementById('emailSubject').value;
            const body = document.getElementById('emailBody').value;
            data = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            break;
        case 'payment':
            const paymentType = document.getElementById('paymentType').value;
            const paymentId = document.getElementById('paymentId').value;
            data = generatePaymentLink(paymentType, paymentId);
            break;
    }

    if (!data) {
        alert('Please fill in all required fields');
        return;
    }

    try {
        // Clear previous QR code
        qrCode.innerHTML = '';
        
        // Create new QR code
        qr = new QRCode(qrCode, {
            text: data,
            width: qrSize.value,
            height: qrSize.value,
            colorDark: qrColor.value,
            colorLight: "transparent",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Add logo if exists
        if (currentLogo) {
            addLogoToQR(currentLogo, qrSize.value);
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Error generating QR code. Please try again.');
    }
}

function updateQRCode() {
    if (!qr) return;
    generateQRCode();
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleLogoFile(file);
    } else {
        alert('Please drop an image file');
    }
}

function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleLogoFile(file);
    } else {
        alert('Please select an image file');
    }
}

function handleLogoFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentLogo = e.target.result;
        if (qr) {
            updateQRCode();
        }
    };
    reader.readAsDataURL(file);
}

function addLogoToQR(logo, size) {
    // Remove any existing logo
    const existingLogo = qrCode.querySelector('.qr-logo');
    if (existingLogo) {
        existingLogo.remove();
    }

    // Calculate logo size and position
    const logoSize = size * 0.2;
    const logoPosition = (size - logoSize) / 2;
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'qr-logo-container';
    logoContainer.style.position = 'absolute';
    logoContainer.style.top = '50%';
    logoContainer.style.left = '50%';
    logoContainer.style.transform = 'translate(-50%, -50%)';
    logoContainer.style.width = `${logoSize}px`;
    logoContainer.style.height = `${logoSize}px`;
    logoContainer.style.background = 'white';
    logoContainer.style.padding = '5px';
    logoContainer.style.borderRadius = '5px';
    logoContainer.style.zIndex = '1';
    logoContainer.style.display = 'flex';
    logoContainer.style.alignItems = 'center';
    logoContainer.style.justifyContent = 'center';
    
    // Create and style logo image
    const logoImg = document.createElement('img');
    logoImg.src = logo;
    logoImg.className = 'qr-logo';
    logoImg.style.width = '100%';
    logoImg.style.height = '100%';
    logoImg.style.objectFit = 'contain';
    
    // Add logo image to container
    logoContainer.appendChild(logoImg);
    
    // Add container to QR code
    qrCode.appendChild(logoContainer);
}

function generatePaymentLink(type, id) {
    switch (type) {
        case 'upi':
            return `upi://pay?pa=${id}`;
        case 'paypal':
            return `https://paypal.me/${id}`;
        case 'stripe':
            return `https://stripe.com/pay/${id}`;
        default:
            return '';
    }
}

async function downloadQRCode(format) {
    const qrElement = qrCode.querySelector('img:not(.qr-logo)');
    if (!qrElement) {
        alert('Please generate a QR code first');
        return;
    }

    try {
        switch (format) {
            case 'png':
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = qrSize.value;
                canvas.height = qrSize.value;
                
                // Clear canvas with transparent background
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw QR code
                ctx.drawImage(qrElement, 0, 0);
                
                // Draw logo if exists
                if (currentLogo) {
                    const logoImg = new Image();
                    await new Promise((resolve, reject) => {
                        logoImg.onload = resolve;
                        logoImg.onerror = reject;
                        logoImg.src = currentLogo;
                    });
                    
                    const logoSize = qrSize.value * 0.2;
                    
                    // Draw white background for logo
                    ctx.fillStyle = 'white';
                    ctx.fillRect(
                        qrSize.value / 2 - logoSize / 2 - 5,
                        qrSize.value / 2 - logoSize / 2 - 5,
                        logoSize + 10,
                        logoSize + 10
                    );
                    
                    // Draw logo with proper scaling
                    ctx.save();
                    ctx.translate(qrSize.value / 2, qrSize.value / 2);
                    ctx.rotate(0);
                    ctx.drawImage(
                        logoImg,
                        -logoSize / 2,
                        -logoSize / 2,
                        logoSize,
                        logoSize
                    );
                    ctx.restore();
                }
                
                const link = document.createElement('a');
                link.download = 'qr-code.png';
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                break;

            case 'svg':
                // Create SVG element
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', qrSize.value);
                svg.setAttribute('height', qrSize.value);
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                
                // Add QR code image
                const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                image.setAttribute('width', qrSize.value);
                image.setAttribute('height', qrSize.value);
                image.setAttribute('href', qrElement.src);
                svg.appendChild(image);
                
                // Add logo if exists
                if (currentLogo) {
                    const logoSize = qrSize.value * 0.2;
                    const logoX = (qrSize.value - logoSize) / 2;
                    const logoY = (qrSize.value - logoSize) / 2;
                    
                    // Add white background for logo
                    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttribute('x', logoX - 5);
                    rect.setAttribute('y', logoY - 5);
                    rect.setAttribute('width', logoSize + 10);
                    rect.setAttribute('height', logoSize + 10);
                    rect.setAttribute('fill', 'white');
                    svg.appendChild(rect);
                    
                    // Add logo
                    const logo = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                    logo.setAttribute('x', logoX);
                    logo.setAttribute('y', logoY);
                    logo.setAttribute('width', logoSize);
                    logo.setAttribute('height', logoSize);
                    logo.setAttribute('href', currentLogo);
                    svg.appendChild(logo);
                }
                
                // Convert SVG to string
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svg);
                const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
                const svgUrl = URL.createObjectURL(svgBlob);
                
                // Download SVG
                const svgLink = document.createElement('a');
                svgLink.download = 'qr-code.svg';
                svgLink.href = svgUrl;
                svgLink.click();
                URL.revokeObjectURL(svgUrl);
                break;

            case 'pdf':
                // Create canvas for PDF
                const pdfCanvas = document.createElement('canvas');
                const pdfCtx = pdfCanvas.getContext('2d');
                pdfCanvas.width = qrSize.value;
                pdfCanvas.height = qrSize.value;
                
                // Draw QR code
                pdfCtx.drawImage(qrElement, 0, 0);
                
                // Draw logo if exists
                if (currentLogo) {
                    const logoImg = new Image();
                    await new Promise((resolve, reject) => {
                        logoImg.onload = resolve;
                        logoImg.onerror = reject;
                        logoImg.src = currentLogo;
                    });
                    
                    const logoSize = qrSize.value * 0.2;
                    
                    // Draw white background for logo
                    pdfCtx.fillStyle = 'white';
                    pdfCtx.fillRect(
                        qrSize.value / 2 - logoSize / 2 - 5,
                        qrSize.value / 2 - logoSize / 2 - 5,
                        logoSize + 10,
                        logoSize + 10
                    );
                    
                    // Draw logo
                    pdfCtx.save();
                    pdfCtx.translate(qrSize.value / 2, qrSize.value / 2);
                    pdfCtx.rotate(0);
                    pdfCtx.drawImage(
                        logoImg,
                        -logoSize / 2,
                        -logoSize / 2,
                        logoSize,
                        logoSize
                    );
                    pdfCtx.restore();
                }
                
                // Create PDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [qrSize.value, qrSize.value]
                });
                
                const imgData = pdfCanvas.toDataURL('image/png', 1.0);
                pdf.addImage(imgData, 'PNG', 0, 0, qrSize.value, qrSize.value);
                pdf.save('qr-code.pdf');
                break;
        }
    } catch (error) {
        console.error('Error downloading QR code:', error);
        alert('Error downloading QR code. Please try again.');
    }
}

// Initialize form fields
updateFormFields(); 