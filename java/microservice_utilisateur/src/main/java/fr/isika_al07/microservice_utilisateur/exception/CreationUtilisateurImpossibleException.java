package fr.isika_al07.microservice_utilisateur.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)    
public class CreationUtilisateurImpossibleException extends RuntimeException {

	/**
	 * 
	 */
	public CreationUtilisateurImpossibleException(String message) {
		super(message);
	}

}