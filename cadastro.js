function salvarCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById('firstname').value;
    const sobrenome = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const celular = document.getElementById('number').value;
    const senha = document.getElementById('password').value;
    const confirmarSenha = document.getElementById('Confirmpassword').value;

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const usuario = {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        celular: celular,
        senha: senha
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
}
