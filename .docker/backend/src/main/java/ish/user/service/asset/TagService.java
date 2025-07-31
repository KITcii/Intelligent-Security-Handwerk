package ish.user.service.asset;

import ish.user.model.Company;
import ish.user.model.asset.Tag;
import ish.user.repository.asset.TagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TagService {

    private TagRepository tagRepository;

    public List<Tag> getAllTags(Company company) {
        return tagRepository.findByCompany(company);
    }

    public List<Tag> getAllTags(Long companyId) {
        return tagRepository.findByCompanyId(companyId);
    }
}
