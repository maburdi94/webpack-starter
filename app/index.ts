'use strict';

// global styles
import './styles.css';


const template: HTMLTemplateElement = document.createElement('template');

template.innerHTML = `
    <style>
        :host {
            display: block;
            height: 100px;
            color: white;
            background-color: #46c6ee;
        }
    </style>
    <h1>This is a Custom Element Test</h1>
`;


export class CustomElement extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('custom-element', CustomElement);
