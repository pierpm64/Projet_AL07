package fr.isika_al07.microservice_utilisateur.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NO_CONTENT)    
public class UtilisateurInexistantException extends RuntimeException {
	/**
	 * @param message
	 */
	public UtilisateurInexistantException(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
}