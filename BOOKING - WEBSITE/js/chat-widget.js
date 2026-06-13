(function() {
    // Inject Widget CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .floating-chat-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 65px;
            height: 65px;
            background: #e1a642;
            color: #111111;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            transition: all 0.3s;
        }
        .floating-chat-btn:hover {
            transform: scale(1.1) rotate(-5deg);
            background: #f3c26b;
        }
        .chat-widget-container {
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 380px;
            height: 600px;
            background: transparent;
            z-index: 10000;
            display: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,0.25);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: bottom right;
            transform: scale(0.5);
            opacity: 0;
        }
        .chat-widget-container.active {
            display: block;
            transform: scale(1);
            opacity: 1;
        }
        .chat-widget-container.minimized {
            height: 70px;
            width: 350px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            bottom: 0;
        }
        .chat-widget-container.maximized {
            bottom: 0;
            right: 0;
            width: 100vw;
            height: 100vh;
            border-radius: 0;
        }
        .chat-widget-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        @media (max-width: 768px) {
            .chat-widget-container {
                width: 90vw;
                right: 5vw;
                height: 70vh;
                bottom: 100px;
            }
            .chat-widget-container.maximized {
                width: 100vw;
                right: 0;
                height: 100vh;
                bottom: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Floating Button
    const btn = document.createElement('div');
    btn.className = 'floating-chat-btn';
    btn.innerHTML = '<i class="fa-solid fa-comments"></i>';
    document.body.appendChild(btn);

    // Iframe Container
    const container = document.createElement('div');
    container.className = 'chat-widget-container';
    container.innerHTML = '<iframe src="chat.html?widget=true" class="chat-widget-iframe"></iframe>';
    document.body.appendChild(container);

    let isOpen = false;

    // Toggle Chat visibility
    btn.addEventListener('click', () => {
        if (!isOpen) {
            container.style.display = 'block';
            setTimeout(() => container.classList.add('active'), 10);
            isOpen = true;
        } else {
            container.classList.remove('active');
            setTimeout(() => {
                container.style.display = 'none';
            }, 300);
            isOpen = false;
            
            // Restore normal state if minimized or maximized
            container.classList.remove('minimized');
            container.classList.remove('maximized');
        }
    });

    // Listen for window control messages from iframe
    window.addEventListener('message', (e) => {
        if (e.data === 'minimizeChat') {
            container.classList.toggle('minimized');
            container.classList.remove('maximized');
        } else if (e.data === 'maximizeChat') {
            container.classList.toggle('maximized');
            container.classList.remove('minimized');
        } else if (e.data === 'closeChat') {
            container.classList.remove('active');
            setTimeout(() => {
                container.style.display = 'none';
            }, 300);
            isOpen = false;
        }
    });
})();
