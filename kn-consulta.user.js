// ==UserScript==
// @name         KN Consulta — Demo local
// @namespace    kn-consulta-demo
// @version      1.0.0
// @description  Marca a demonstração local; não consulta sistemas externos.
// @match        file:///*/demo.html
// @grant        none
// @run-at       document-end
// ==/UserScript==
(() => {
  'use strict';
  if (document.title !== 'KN Consulta | Demonstração') return;
  const marker = document.createElement('p');
  marker.textContent = 'UserScript demonstrativo ativo • processamento local com dados fictícios';
  document.querySelector('header')?.append(marker);
})();
