package ish.user.service.asset;

import ish.user.model.Company;
import ish.user.model.asset.Alias;
import ish.user.repository.asset.AliasRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AliasService {

    private final AliasRepository aliasRepository;

    public List<Alias> getAllAliases(Company company) {
        return aliasRepository.findByCompany(company);
    }

    public List<Alias> getAllAliases(Long companyId) {
        return aliasRepository.findByCompanyId(companyId);
    }

}
