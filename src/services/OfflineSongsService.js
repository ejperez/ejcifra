var prefix = 'song-';

var OfflineSongsService = {
	get: function ( search ) {
		let songs = [];

		Object.keys( localStorage ).forEach( function ( key ) {
			if ( key.indexOf( prefix ) !== -1 ) {
				let song = localStorage.getItem( key );

				if ( !song )
					return;

				song = JSON.parse( song );

				if ( search ) {
					search = search.toLowerCase();

					if( song.title.toLowerCase().indexOf( search ) === -1 && song.artists.toLowerCase().indexOf( search ) === -1 )
						return;
				}

				songs.push( song );
			}
		} );

		return songs;
	},
	getSingle: function ( id ) {
		let song = localStorage.getItem( prefix + id );

		if ( !song )
			return null;

		return JSON.parse( song );
	},
	save: function ( id, song ) {
		localStorage.setItem( prefix + id, JSON.stringify( song ) );
	},
	delete: function ( id ) {
		localStorage.removeItem( prefix + id );
	}
};

export default OfflineSongsService;
