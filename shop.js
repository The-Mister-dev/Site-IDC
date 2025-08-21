// Shop functionality for boutique page

document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp order function
    window.orderWhatsApp = function(productName, price) {
        // Replace with actual WhatsApp number
        const phoneNumber = '2250713604482'; // Example French number
        const message = `Bonjour, je souhaite commander ${productName} au prix de ${price}. Pouvez-vous me donner plus d'informations ?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');
        
        // Track the order (for analytics)
        trackOrder(productName, price);
    };

    function trackOrder(productName, price) {
        // This could be integrated with Google Analytics or other tracking
        console.log(`Order tracked: ${productName} - ${price}`);
        
        // Show order confirmation
        showOrderConfirmation(productName);
    }

    function showOrderConfirmation(productName) {
        const confirmation = document.createElement('div');
        confirmation.className = 'order-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fab fa-whatsapp"></i>
                <h3>Commande initiée</h3>
                <p>Votre demande pour <strong>${productName}</strong> va être ouverte dans WhatsApp.</p>
                <p>Notre équipe vous répondra rapidement !</p>
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.style.opacity = '0';
                setTimeout(() => {
                    confirmation.remove();
                }, 300);
            }
        }, 4000);
    }

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productBtn = card.querySelector('.product-btn');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-hover)';
        });
    });

    // Add to wishlist functionality (future feature)
    function addToWishlist(productName) {
        const wishlist = JSON.parse(localStorage.getItem('idc-wishlist') || '[]');
        
        if (!wishlist.includes(productName)) {
            wishlist.push(productName);
            localStorage.setItem('idc-wishlist', JSON.stringify(wishlist));
            
            showWishlistNotification(productName, 'added');
        } else {
            showWishlistNotification(productName, 'exists');
        }
    }

    function showWishlistNotification(productName, action) {
        const messages = {
            'added': `${productName} ajouté à votre liste de souhaits !`,
            'exists': `${productName} est déjà dans votre liste de souhaits.`
        };
        
        const notification = document.createElement('div');
        notification.className = 'wishlist-notification';
        notification.textContent = messages[action];
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Product quick view (future feature)
    function showProductQuickView(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        const productDescription = productCard.querySelector('.product-description').textContent;
        
        const quickView = document.createElement('div');
        quickView.className = 'product-quick-view';
        quickView.innerHTML = `
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                <div class="quick-view-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="quick-view-info">
                    <h2>${productName}</h2>
                    <p class="quick-view-price">${productPrice}</p>
                    <p class="quick-view-description">${productDescription}</p>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary" onclick="orderWhatsApp('${productName}', '${productPrice}')">
                            <i class="fab fa-whatsapp"></i>
                            Commander sur WhatsApp
                        </button>
                        <button class="btn btn-secondary" onclick="addToWishlist('${productName}')">
                            <i class="fas fa-heart"></i>
                            Ajouter aux favoris
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(quickView);
        
        // Close functionality
        const closeBtn = quickView.querySelector('.quick-view-close');
        closeBtn.addEventListener('click', () => {
            quickView.remove();
        });
        
        quickView.addEventListener('click', (e) => {
            if (e.target === quickView) {
                quickView.remove();
            }
        });
    }

    // Product filtering (future feature)
    function filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Price formatting
    function formatPrice(price) {
        return price.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        });
    }

    // Add CSS for shop-specific styles
    const style = document.createElement('style');
    style.textContent = `
        .order-confirmation {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(37, 211, 102, 0.95);
            color: white;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            z-index: 9999;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            animation: orderPop 0.3s ease-out;
        }
        
        .confirmation-content i {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .confirmation-content h3 {
            margin-bottom: 1rem;
        }
        
        .wishlist-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #FFD700;
            color: #000;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 9999;
            font-weight: 600;
        }
        
        .wishlist-notification.show {
            transform: translateX(0);
        }
        
        .product-quick-view {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        }
        
        .quick-view-content {
            background: white;
            border-radius: 10px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            display: flex;
            position: relative;
        }
        
        .quick-view-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1;
        }
        
        .quick-view-image {
            flex: 1;
            max-width: 400px;
        }
        
        .quick-view-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .quick-view-info {
            flex: 1;
            padding: 2rem;
        }
        
        .quick-view-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: #FFD700;
            margin: 1rem 0;
        }
        
        .quick-view-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        @keyframes orderPop {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .quick-view-content {
                flex-direction: column;
                margin: 20px;
                max-height: calc(100vh - 40px);
            }
            
            .quick-view-actions {
                flex-direction: column;
            }
            
            .order-confirmation {
                margin: 20px;
                width: calc(100% - 40px);
                transform: translate(-50%, -50%);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize shop features
    console.log('Shop functionality loaded');
    
    // Add global wishlist function
    window.addToWishlist = addToWishlist;
});