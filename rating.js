class RatingWidget extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = `
            .hover {
                color: var(--hover-color, rgb(50, 50, 50));
            }
            .invisible {
                display: none;
            }
        `;
        this.shadowRoot.appendChild(style);
        this.message = document.createElement('p');
        this.shadowRoot.appendChild(this.message);
    }

    connectedCallback() {
        const ratingInput = this.querySelector('#rating');
        for (let i = 0; i < 5; i++) {
            const star = this.createStar(i);
            this.shadowRoot.appendChild(star);
        }
    }

    createStar(index) {
        const star = document.createElement('span');
        star.textContent = '✰';
        star.style.cursor = 'pointer';
        star.style.fontSize = '30px';
        star.addEventListener('mouseover', () => {
            this.adjustStar(index + 1);
        });
        star.addEventListener('mouseout', () => {
            this.adjustStar(-1);
        });
        star.addEventListener('click', () => {
            this.submitRating(index + 1);
        });
        return star;
    }

    adjustStar(rating) {
        const stars = this.shadowRoot.querySelectorAll('span');
        stars.forEach((star, index) => {
            star.innerHTML = index < rating ? '★' : '✰';
            star.classList.toggle('hover', index < rating);
        });
    }

    disconnectedCallback() {
        this.shadowRoot.innerHTML = '';
    }

    submitRating(rating) {
        const ratingInput = this.querySelector('#rating');
        const stars = this.shadowRoot.querySelectorAll('span');
        stars.forEach(star => star.classList.add('invisible'));

        if (rating >= 4){
            this.message.textContent = 'Thanks for ' + rating + ' star rating!';
        } else {
            this.message.textContent = 'Thanks for your feedback of ' + rating + ' stars. We will try to do better!';
        }

        const sentBy = this.querySelector('input[name="sentBy"]');
        sentBy.value = 'JS';
        const formData = new FormData();
        formData.append('question', 'How satisfied are you?');
        formData.append('rating', rating);
        formData.append('sentBy', 'JS');

        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: {
                'X-Sent-By': 'JS'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
        })
        .catch(error => console.error('Error:', error));
    }
}

customElements.define('rating-widget', RatingWidget);