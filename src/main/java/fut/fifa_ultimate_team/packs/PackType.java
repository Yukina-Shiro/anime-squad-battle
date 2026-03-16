package fut.fifa_ultimate_team.packs;

import java.util.LinkedHashMap;
import java.util.Map;

public enum PackType {

    // Pondération
    COMMON(1000, createProbabilities(80.0, 15.0, 4.0, 1.0)),
    RARE(3000, createProbabilities(40.0, 40.0, 15.0, 5.0)),
    EPIC(5000, createProbabilities(10.0, 30.0, 45.0, 15.0)),
    LEGENDARY(10000, createProbabilities(0.0, 10.0, 40.0, 50.0));

    private final int cost;
    private final Map<String, Double> probabilities;

    PackType(int cost, Map<String, Double> probabilities) {
        this.cost = cost;
        this.probabilities = probabilities;
    }

    public int getCost() {
        return cost;
    }

    public Map<String, Double> getProbabilities() {
        return probabilities;
    }

    private static Map<String, Double> createProbabilities(double common, double rare, double epic, double legendary) {
        Map<String, Double> map = new LinkedHashMap<>();
        map.put("Common", common);
        map.put("Rare", rare);
        map.put("Epic", epic);
        map.put("Legendary", legendary);
        return map;
    }
}