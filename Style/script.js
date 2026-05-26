emailjs.init({ publicKey: "AobSZpq15zimu-OCu" });
window.onload = function () {

    // ================= MENU =================
    const toggle = document.getElementById("menuToggle");
    const menu = document.getElementById("navMenu");

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("menu-open");
    });

    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove("menu-open");
        }
    });

    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', function () {
            isClicked = true;
            document.querySelectorAll('#navMenu a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            menu.classList.remove("menu-open");
        });
    });

    // ================= SCROLL SPY =================
    let isClicked = false;
    let scrollTimer = null;

    const sections = document.querySelectorAll('section');
    const mainEl = document.querySelector('main');

    mainEl.addEventListener('scroll', () => {

        if (isClicked) {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                isClicked = false;
            }, 150);
            return;
        }

        let current = sections[0].id;

        const scrollBottom = mainEl.scrollTop + mainEl.clientHeight;
        const scrollHeight = mainEl.scrollHeight;

        if (scrollBottom >= scrollHeight - 10) {
            current = sections[sections.length - 1].id;
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;

                if (mainEl.scrollTop >= sectionTop) {
                    current = section.id;
                }
            });
        }

        document.querySelectorAll("#navMenu a").forEach(a => {
            a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
        });
    });

    // ================= PORTFOLIO DUPLICATION =================
    const container = document.querySelector(".portofolio-content");
    let isDuplicated = false;

    if (!container.dataset.original) {
        container.dataset.original = container.innerHTML;
    }

    function handlePortfolio() {
        if (window.innerWidth > 991 && !isDuplicated) {
            container.innerHTML += container.dataset.original;
            isDuplicated = true;
        }

        if (window.innerWidth <= 991 && isDuplicated) {
            container.innerHTML = container.dataset.original;
            isDuplicated = false;
        }
    }

    window.addEventListener("resize", handlePortfolio);
    handlePortfolio();

    // ================= INTERSECTION OBSERVER =================
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    document.querySelectorAll(".header-separator, .header-title")
        .forEach(el => observer.observe(el));

    const emailRegex =
        /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;

    function isValidEmail(email) {
        if (typeof email !== "string") return false;

        email = email.trim();

        // must contain exactly one @
        if ((email.match(/@/g) || []).length !== 1) return false;

        return emailRegex.test(email);
    }

    const contactForm = document.querySelector('.form-group');
    const submitButton = document.getElementById('submitbutton');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.querySelector('.message-name input').value.trim();
        const email = document.querySelector('.email-group input').value.trim();
        const subject = document.querySelector('#subject').value.trim() || "No subject";
        const message = document.querySelector('#message').value.trim();

        if (!isValidEmail(email)) {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = "❌ Please type a valid email";
            errorMsg.style.color = "red";
            errorMsg.style.marginTop = "1rem";

            submitButton.insertAdjacentElement('afterend', errorMsg);
            setTimeout(() => errorMsg.remove(), 4000);
            console.error("Error on email");
            return;
        }
        const templateParams = { name, email, subject, message };

        emailjs.send('service_eg5heyk', 'template_xtakgmw', templateParams)
            .then(() => {
                contactForm.reset();
                const successMsg = document.createElement('p');
                successMsg.textContent = "Message sent successfully! ✅";
                successMsg.style.color = "green";
                successMsg.style.marginTop = "1rem";

                submitButton.insertAdjacentElement('afterend', successMsg);

                setTimeout(() => successMsg.remove(), 4000);
            }, (error) => {
                console.error("EmailJS error:", error);

                const errorMsg = document.createElement('p');
                errorMsg.textContent = "Failed to send message. ❌ Please try again later.";
                errorMsg.style.color = "red";
                errorMsg.style.marginTop = "1rem";

                submitButton.insertAdjacentElement('afterend', errorMsg);
                setTimeout(() => errorMsg.remove(), 4000);
            });
    });
};