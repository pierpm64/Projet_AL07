package fr.isika_al07.microservice_utilisateur.http.controler;

import java.util.List;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.isika_al07.microservice_utilisateur.dao.UtilisateurRepository;
import fr.isika_al07.microservice_utilisateur.exception.CreationUtilisateurImpossibleException;
import fr.isika_al07.microservice_utilisateur.exception.UtilisateurInexistantException;
import fr.isika_al07.microservice_utilisateur.model.Utilisateur;

@RestController
@RequestMapping(path = "/utilisateur")
public class UtilisateurControler {

	@Autowired
	UtilisateurRepository utilisateurRepository;


	Logger log = LoggerFactory.getLogger(this.getClass());

	@CrossOrigin
	@PostMapping(path = "/creerUtilisateur")
	public ResponseEntity<Utilisateur> creerUtilisateur(@RequestBody Utilisateur utilisateur) {
		log.info("utilisateur à créer dans UtlisateurControler : " + utilisateur);

		// test que l'email n'existe pas déjà ...
		List<Utilisateur> chkUser = utilisateurRepository.findByEmail(utilisateur.getEmail());
		if (chkUser.size() > 0) {
			throw new CreationUtilisateurImpossibleException("Un utilisateur existe déjà avec cet email");
		}
		
		// si le top admin n'est pas renseigne, on le force à false
		Optional<Boolean> testAdm = Optional.ofNullable(utilisateur.getIsAdmin());
		if (testAdm.isEmpty()) {
			utilisateur.setIsAdmin(false);
		}
		
		utilisateur.setPassword(macEncrypt(utilisateur.getPassword()));
		
		Utilisateur nouveauUtilisateur = utilisateurRepository.save(utilisateur);
		
		if (nouveauUtilisateur.getId() == null)
			throw new CreationUtilisateurImpossibleException("Impossible de créer l'utilisateur");

		return new ResponseEntity<Utilisateur>(nouveauUtilisateur, HttpStatus.CREATED);
	}

	
	@GetMapping(path = "/utilisateurByEmail/{email}")
	public Utilisateur rechercherUtilisateurByEmail(@PathVariable String email) {

		List<Utilisateur> lstUsers = utilisateurRepository.findByEmail(email);
		
		if (lstUsers.size() == 0)
			throw new UtilisateurInexistantException("aucun utilisateur avec cet email");

		return lstUsers.get(0);
	}

	@CrossOrigin
	@GetMapping(path = "/utilisateurByEmailAndPassword/{email}/{password}")
	public Utilisateur rechercherUtilisateurByEmailAndPassword
						(@PathVariable String email, @PathVariable String password) {

		String passwordCrypt = macEncrypt(password);
		List<Utilisateur> lstUsers = utilisateurRepository.
						findByEmailAndPassword(email,passwordCrypt);
		
		if (lstUsers.size() == 0)
			throw new UtilisateurInexistantException
			("aucun utilisateur avec cet email et mot de passe");

		return lstUsers.get(0);
	}



	
	
	// Méthode de cryptage pour le mot de passe
	public String macEncrypt(String strClearText)
	{
		String strCrypte = "";
		
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
		
			String strKey = "Transports Nantes";
			byte[] keyBytes = strKey.getBytes("UTF-8");
			String algorithm  = "RawBytes";
			SecretKeySpec key = new SecretKeySpec(keyBytes, algorithm);

			mac.init(key);
		
			byte[] data  = strClearText.getBytes("UTF-8");
			byte[] macBytes = mac.doFinal(data);
			
			strCrypte = new String(macBytes);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return strCrypte;
	}


}
