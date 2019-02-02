class InstagramRender {

	/* Função responsavel por dar replace na mascaras */
	replace(string, procurar, substituir){

		let i,
			regex 	= [],
			map 	= {};

		for(i = 0; i < procurar.length; i++){

			regex.push( procurar[i].replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1'));
			map[procurar[i]] = substituir[i];
		}

		regex = regex.join('|');

		string = string.replace( new RegExp( regex, 'g' ), function(matched){
			return map[matched];
		});

		return string;
	}

	render(fetch){

		let html 		= '';
		let find 		= [];
		let replace 	= [];

		let link 		= '';
		let likes 		= '';
		let imagem 		= '';
		let nome 		= '';
		let data 		= '';
		for(var x in fetch){

			if(fetch[x].images){

				data 	= fetch[x];

				link 	= data.link;
				likes 	= data.likes.count;
				imagem 	= data.images.low_resolution.url;
				nome 	= data.user.full_name;

				find = ["{{nome}}", "{{likes}}", "{{link}}", "{{imagem}}"];
				replace = [nome, likes, link, imagem];

				html += this.replace(this.mascara, find, replace);
			}
		}

		if(this.renderTo){
			/* Limpa o elemento */
			this.renderTo.innerHTML = '';
			this.warn('Limpamos o elemento aonde vamos renderizar os dados!');

			/* Renderiza novamente !*/
			this.renderTo.innerHTML = html;
			this.warn('Renderizamos ao elemento as novas informações!');
		}else {
			this.erro('Não encontramos o elemento para renderizar');
		}
	}
}

class Instagram extends InstagramRender {

	constructor(token){

		super();

		/* Default */
		this.renderTo		= document.getElementById('postagensInstagram');
		this.access_token 	= token;
		this.count 			= 4;
		this.url_api 		= 'https://api.instagram.com/v1/users/self/media/recent/?access_token={{access_token}}&count={{count}}';
		this.fetch 			= [];
		this.mascara		= `
			<div>
				<div>Nome: {{nome}} </div>
				<div>Likes: {{likes}}</div>
				<div><img src="{{imagem}}" alt="{{nome}}" /></div>
				<div>URL: <a href="{{link}}">Abrir no instagram</a></div>
				<br />
				<hr />
				<br />
			</div>
		`;

		/* Se logs estiver TRUE, mostra os logs no console */
		this.logs 			= true;
	}

	go(){
		this.request();
	}

	/* GET */

	/* Retornamos o valor Count */
	get getCount(){
		return this.count;
	}

	/* Retornamos o Token */
	get getToken(){
		return this.access_token;
	}

	/* Retornamos a URL - get API */
	get getUrl(){
		this.url_api = this.url_api.replace('{{access_token}}', this.access_token);
		this.url_api = this.url_api.replace('{{count}}', this.count);
		return this.url_api;
	}

	/* Retornamos o Fetch - Objeto com os dados */
	get getFetch(){
		return this.fetch;
	}

	/* Retornamos a Máscara HTML */
	get getMascara(){
		return this.mascara;
	}

	/* Retornamos o elemento aonde será renderizado os dados*/
	get getRenderto(){
		return this.renderTo;
	}

	/* Retornamos o estado do Logs */
	get getLogs(){
		return this.logs;
	}

	/* SET */

	/* Alteramos o count - número de publicações */
	set setCount(newCount){

		/* Não aceitamos letras, somente números! */
		if(isNaN(newCount)){

			return this.erro('Oque você informou não é um número!');
		}

		/* Não pode número menor que zero */
		if(newCount <= 0){

			return this.erro('Eu não aceito números negativos!');
		}

		let valor = Number(newCount);

		this.count = valor;
		this.warn('Foi alterado o Count para: "' + this.count + '"');
	}

	/* Alteramos o token */
	set setToken(newToken){

		if(!isNaN(newToken)){
			return this.erro('Oque você informou não é um token válido!');
		}

		this.access_token = newToken;

		this.warn('Foi alterado o TOKEN de acesso à API para: "' + this.access_token + '"')
	}

	/* Alteramos a URL */
	set setUrl(newUrl){

		/* separar a URL por /. para verificar se é uma url válida */
		let url = newUrl.split('/');

		/* Verifica se há protocolo */
		if(url[0] !== 'http:' && url[0] !== 'https:'){
			return this.erro('Você precisa informar o protocolo da URL!');
		}

		/* Verifica se o dominio é do instagram */
		if(url[2] !== 'api.instagram.com'){
			return this.erro('O domínio informado não é do instagram!');
		}

		this.url_api = newUrl;

		this.warn('Foi alterado a URL para "' + this.url_api + '"');
	}

	/* Alteramos o Logs */
	set setLogs(status){

		if(status === 1 || status === true){
			this.logs = true;
		}else{
			this.logs = false;		
		}

		console.log('O estado do Logs está ' + this.logs);
	}

	/* Alteramos a máscara */
	set setMascara(newMascara){

		this.mascara = newMascara;

		this.warn('Foi alterada a máscara de renderização dos dados. Nova mascara é \n ' + this.mascara);
	}

	/* Alteramos o elemento que será renderizado os dados */
	set setRenderto(elemento){

		if(document.getElementById(elemento)){

			if(document.body.contains(document.getElementById(elemento))){
				
				this.renderTo = elemento;

				this.warn('Foi alterado o elemento para renderizar os dados. ID: "' + elemento + '" - Elemento: ' + this.renderTo);
			}else{
				this.erro('Por algum motivo, não encontramos esse elemento no DOM!');
			}

		}else{
			
			this.erro('Não encontramos este elemento na página com esse ID: "' + elemento + '"');			
		}
	}

	/* Retorna console.error SE logs for TRUE */
	erro(texto){

		if(this.logs === true){
			console.error(texto);
		}
	}

	/* Retorna console.warn SE logs for TRUE */
	warn(texto){

		if(this.logs === true){
			console.warn(texto);
		}
	}

	/* Faz a requisição a API do instagram */
	request(){

		/* Verifica se existe algum TOKEN */
		if(this.access_token == '' || this.access_token == 'SEU_TOKEN_AQUI' || this.access_token == 'undefined'){
			
			this.erro('Eu preciso do seu Token de acesso a API!!');
		
		}else{
			let procurar 	= ["{{access_token}}", "{{count}}"];
			let substituir 	= [this.access_token, this.count];

			let newUrl = this.replace(this.url_api, procurar, substituir);

			fetch(newUrl,{
				method: 'get'
			})
			.then(response => response.json())
			.then(json => this.render(json.data))
			.catch(err => console.log(err));
		}
	}
}