# REQUISITO 

1) TOKEN
  - Primeiro você precisa gerar seu TOKEN_DE_ACESSO, existem vários lugares que você pode aprender.

# USAGE
1) HTML..
```
<html>
<head>
	<title>Classe ES6 Instagram</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script type="text/javascript" src="js/instagram.js" charset="utf-8"></script>
</head>
<body>
	<h1>Classe ES6 Instagram</h1>
	<div id="postagensInstagram"></div>
	<script>
		var TOKEN_INSTAGRAN = 'SEU_TOKEN_AQUI';
		var i = new Instagram(TOKEN_INSTAGRAN);
		i.go();
	</script>
</body>
</html>
</script>
```

2) Oque posso fazer:
  - uma vez com a classe instanciada, você pode manipular as parada.
  - Informações
  	*{{nome}} 		= nome de usuário do instagram - João Silva
	*{{data}} 		= data da publicação - 02/02/2019
	*{{link}} 		= link para a publicação
	*{{likes}} 		= número de Likes da publicação
	*{{img_perfil}} 		= link imagem de perfil do usuário 
	*{{imagem}} = link da imagem da publicação - ``` exp: <img src="{{imagem}}" alt="{{nome}}" />```
   - Com essa informaçes, o céu é o limite!
  
   Exp:
```
<script>
   var insta = new Instagra(TOKEN_INSTAGRAM);

    insta.count = 3; 
      // Irá exibir somente as ultimas 3 publicaçes
    
    insta.mascara = '<h1>{{nome}}</h1><p><img src="{{imagem}}" alt="{{nome}}" /></p>';
      // Irá exibir o NOME e a IMAGEM da publicação
     
    insta.renderTo = 'ID_ELEMENTO';
      // Irá apontar PELO ID para qual elemento no DOM irá renderizar os dados
     
    insta.go();
      // Irá renderizar no DOM
</script
```

3) EXTRA..

```
<script>
  insta.getFetch;
    // Retorna os dados da ultima requisição
  
  insta.getCount;
    // Retorna o valor da quantidade da última requisição
  
  insta.getToken;
    // Retorna o Token
    
  insta.getRenderto;
    // Retorna o último elemento que foi renderizado
    
  insta.getMascara;
     // Retorna o HTML que irá ser renderizado os dados
</script>
```
