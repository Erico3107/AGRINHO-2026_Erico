/* ============================================
   PROJETO AGRINHO 2026 - SCRIPT PRINCIPAL
   ============================================ */

// ============================================
// FUNÇÃO: Flip dos Flash Cards
// ============================================
function flipCard(card) {
    card.classList.toggle('flipped');
}

// ============================================
// FUNÇÃO: Smooth Scroll para links internos
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 60; // Desconta altura do nav fixo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FUNÇÃO: Máscara de Telefone
// ============================================
function initPhoneMask() {
    const telefoneInput = document.getElementById('telefone');
    if (!telefoneInput) return;
    
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Aplica a máscara
        if (value.length > 0) {
            if (value.length <= 2) {
                value = value.replace(/^(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    });
}

// ============================================
// FUNÇÃO: Validação do Formulário
// ============================================
function validateForm(formData) {
    const errors = [];
    
    // Validação do nome (mínimo 3 caracteres)
    if (formData.nome.length < 3) {
        errors.push('Nome deve ter pelo menos 3 caracteres');
    }
    
    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('E-mail inválido');
    }
    
    // Validação do telefone (mínimo 10 dígitos)
    const telefoneLimpo = formData.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10) {
        errors.push('Telefone inválido');
    }
    
    // Validação da categoria
    if (!formData.categoria) {
        errors.push('Selecione uma categoria');
    }
    
    // Validação da cidade
    if (formData.cidade.length < 3) {
        errors.push('Informe uma cidade válida');
    }
    
    return errors;
}

// ============================================
// FUNÇÃO: Submit do Formulário
// ============================================
function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Valida os dados
    const errors = validateForm(data);
    
    if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n\n• ' + errors.join('\n• '));
        return;
    }
    
    // Simulação de envio (aqui você pode integrar com um backend real)
    console.log('Dados da inscrição:', data);
    
    // Mensagem de sucesso
    const mensagemSucesso = `
✅ Inscrição realizada com sucesso!

📋 Dados da Inscrição:
━━━━━━━━━━━━━━━━━━━━━
👤 Nome: ${data.nome}
📧 E-mail: ${data.email}
📱 Telefone: ${data.telefone}
🏷️ Categoria: ${data.categoria}
📍 Local: ${data.cidade}
━━━━━━━━━━━━━━━━━━━━━

📅 Em breve entraremos em contato com mais informações sobre o Agrinho 2026.

Obrigado por participar! 🌾
    `;
    
    alert(mensagemSucesso);
    
    // Limpa o formulário
    form.reset();
    
    // Rola para o topo da seção
    document.getElementById('agrinho').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// ============================================
// FUNÇÃO: Animação ao Scroll (Intersection Observer)
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplica a classe de animação nos elementos
    const elementsToAnimate = document.querySelectorAll(
        '.stat-card, .flashcard, .agrinho-info, .form-container, .about-content > *'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// FUNÇÃO: Navegação ativa baseada no scroll
// ============================================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.opacity = '1';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.opacity = '1';
                link.style.fontWeight = 'bold';
            } else {
                link.style.fontWeight = '500';
            }
        });
    });
}

// ============================================
// FUNÇÃO: Contador animado para estatísticas
// ============================================
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const finalText = element.textContent;
                
                // Extrai apenas os números do texto
                const numbers = finalText.match(/\d+/g);
                if (numbers) {
                    const finalNumber = parseInt(numbers[0]);
                    let currentNumber = 0;
                    const increment = finalNumber / 50;
                    const prefix = finalText.match(/^[^\d]*/)[0];
                    const suffix = finalText.match(/[^\d]*$/)[0];
                    
                    const counter = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= finalNumber) {
                            element.textContent = finalText;
                            clearInterval(counter);
                        } else {
                            element.textContent = prefix + Math.floor(currentNumber) + suffix;
                        }
                    }, 30);
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ============================================
// FUNÇÃO: Efeito de sombra na navegação ao rolar
// ============================================
function initNavShadow() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// ============================================
// INICIALIZAÇÃO - Quando o DOM estiver pronto
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌾 Site AgroBrasil - Agrinho 2026 carregado com sucesso!');
    
    // Inicializa todas as funcionalidades
    initSmoothScroll();
    initPhoneMask();
    initScrollAnimations();
    initActiveNavOnScroll();
    animateCounters();
    initNavShadow();
});

// ============================================
// EXPORTAÇÃO (caso use módulos)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        flipCard,
        handleSubmit,
        validateForm
    };
}