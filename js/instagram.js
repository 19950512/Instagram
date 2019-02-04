class InstagramRender {

	/* Formato timestamp para Data */
	time(timestamp){

		let a = new Date(timestamp * 1000);
		let months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
		let year = a.getFullYear();
		let month = months[a.getMonth()];
		let date = a.getDate();
		let time = date + '/' + month + '/' + year;
		return time;
	}

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

	async render(fetch){

		let html 		= '';
		let find 		= [];
		let replace 	= [];

		let link 		= '';
		let likes 		= '';
		let imagem 		= '';
		let nome 		= '';
		let data 		= '';
		let dataPublic	= '';
		let imgProfile  = '';
		let commentsHTML = '';

		this.fetch = fetch;

		for(var x in fetch){

			if(fetch[x].images){

				data 	= fetch[x];

				// Só irá fazer request dos comentários, se houve pelo menos 1 comentário
				/*if(data.comments.count >= 1){
					var coments = await this.requestComments(data.id);

					for(var i in coments){

						console.log(coments[i].id);
						commentsHTML += '<p>' + coments[x].text +'</p>'; 
						
					}
				}*/

				link 	= data.link;
				likes 	= data.likes.count;
				imagem 	= data.images.low_resolution.url;
				nome 	= data.user.full_name;
				dataPublic = this.time(data.created_time);
				imgProfile = data.user.profile_picture;

				find = ["{{nome}}", "{{likes}}", "{{link}}", "{{imagem}}", "{{data}}", "{{img_perfil}}", "{{commentarios}}"];
				replace = [nome, likes, link, imagem, dataPublic, imgProfile, commentsHTML];

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
				<div>Publicado: {{data}}</div>
				<div><img src="{{imagem}}" alt="{{nome}}" /></div>
				<div>{{commentarios}}</div>
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

			// Salva a nova URL no method
			this.url_api = newUrl;
			
			// Faz o request para a URL
			this._requestSend(newUrl);
		}
	}

	async requestComments(media_id){
		this.url_api = 'https://api.instagram.com/v1/media/' + media_id + '/comments?access_token=' + this.access_token;

		let newUrl = this.url_api;

		let fetch = await this._fetch(newUrl);

		// Retorna os comentarios
		if(fetch.data){
			return fetch.data;
		}
	}

	async _requestSend(newUrl){

		try	{

			const fetch = await this._fetch(newUrl);

			// Retorna as publicações
			if(fetch.data){
				return this.render(fetch.data);
			}

		} catch (e){

			this.erro(e);
		}
	}

	_fetch(newUrl){
		
		return new Promise((res, rej) => {

			let fe = fetch(newUrl, {
				method: 'get'
			})
			.then( res => res.json())
			.then(res => {
				return res;
			})
			.catch( erro => {
				this.erro('Ops, Error: '+ erro);
			})


			res(fe);
		});

	}
}
