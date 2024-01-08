// Add this code in your JavaScript file

function openPaymentApp(paymentMethod) {
    let deepLinkUrl = '';

    // Define deep linking URLs for each payment app
    switch (paymentMethod) {
        case 'Paytm':
            deepLinkUrl = 'paytm://open';
            break;
        case 'Google Pay':
            deepLinkUrl = 'upi://pay';
            break;
        case 'Amazon Pay':
            deepLinkUrl = 'upi://pay';
            break;  
        case 'Phone Pay':
            deepLinkUrl = 'upi://pay';
            break;      
        // Add cases for other payment apps as needed
        default:
            console.error('Payment app not supported');
            return;
    }

    // Redirect to the deep linking URL
    window.location.href = deepLinkUrl;
}

// Function to fetch UPI IDs from Firebase
function fetchUpiIds() {
    const upiIdInput = document.getElementById("upiId");

    db.collection("upiIds").doc("id") // Replace "your_document_id" with the actual document ID
        .get()
        .then((doc) => {
            if (doc.exists) {
                const upiId = doc.data().upiId;
                upiIdInput.value = upiId;
            } else {
                console.error("UPI ID document not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching UPI ID:", error);
        });
}

function copyToClipboard() {
    const upiIdElement = document.getElementById("upiId");
    const range = document.createRange();
    range.selectNode(upiIdElement);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    alert("UPI ID copied to clipboard!");
}

// Call this function to fetch UPI IDs when the page loads
fetchUpiIds();

function submitPayment() {
    const screenshotFile = document.getElementById("screenshot").files[0];
    const transactionId = document.getElementById("transactionId").value;

    const storageRef = firebase.storage().ref(`screenshots/${Date.now()}_${screenshotFile.name}`);
    const progressBar = document.getElementById("progressBar");

    progressBar.style.width = "0%";
    progressBar.style.backgroundColor = "#4caf50";

    const uploadTask = storageRef.put(screenshotFile);

    uploadTask.on("state_changed",
        (snapshot) => {
            // Progress tracking
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressBar.style.width = `${progress}%`;
        },
        (error) => {
            console.error("Error uploading screenshot:", error);
            progressBar.style.backgroundColor = "#ff0000";
        },
        () => {
            // Upload completed successfully
            uploadTask.snapshot.ref.getDownloadURL().then((screenshotUrl) => {
                db.collection("payments").add({
                    upiId: "your_upi_id@upi", // Replace with your actual UPI ID
                    screenshotUrl,
                    transactionId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    alert("Payment submitted successfully!");
                    // Reset the progress bar
                    progressBar.style.width = "0%";
                    progressBar.style.backgroundColor = "#4caf50";
                })
                .catch((error) => {
                    console.error("Error submitting payment:", error);
                });
            });
        }
    );
}
