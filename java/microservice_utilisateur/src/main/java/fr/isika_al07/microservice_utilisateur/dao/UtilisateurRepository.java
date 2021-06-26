package fr.isika_al07.microservice_utilisateur.dao;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import fr.isika_al07.microservice_utilisateur.model.Utilisateur;

public interface UtilisateurRepository extends CrudRepository<Utilisateur,Long>{
	
	List<Utilisateur> findByEmail(String email);
	
	List<Utilisateur> findByEmailAndPassword(String email,String password);
	
	List<Utilisateur> findByPseudo(String pseudo);

}
