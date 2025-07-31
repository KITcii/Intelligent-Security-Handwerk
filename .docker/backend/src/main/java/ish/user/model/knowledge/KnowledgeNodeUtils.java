package ish.user.model.knowledge;

import java.util.*;

public class KnowledgeNodeUtils {

    public static <T extends KnowledgeNode<T>> List<T> getSubtreeAsList(T rootNode) {
        List<T> result = new ArrayList<>();

        if (Objects.isNull(rootNode)) {
            return result;
        }

        Deque<T> stack = new ArrayDeque<>();
        stack.push(rootNode);

        while (!stack.isEmpty()) {
            T currentNode = stack.pop();
            result.add(currentNode);

            List<T> children = currentNode.getChildren();
            if (Objects.nonNull(children)) {
                children.forEach(stack::push);
            }
        }

        return result;
    }

}
