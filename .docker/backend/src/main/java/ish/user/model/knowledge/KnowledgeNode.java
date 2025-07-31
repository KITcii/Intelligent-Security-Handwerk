package ish.user.model.knowledge;

import java.util.List;

public interface KnowledgeNode<T extends KnowledgeNode<T>> {

    long getId();

    String getName();

    String getDescription();

    List<T> getChildren();
}
