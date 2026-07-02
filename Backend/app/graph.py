from langgraph.graph import StateGraph, START, END
from app.state import State
from app.nodes.schema_detection import schema_detection_node
from app.nodes.validation import validation
from app.nodes.cleaning import CleaningNode
from app.nodes.analytics import CalculateAnalyticsNode
from app.nodes.visualization import VisualizeData
from app.nodes.insight import insight


graph = StateGraph(State)
graph.add_node("schema_detection", schema_detection_node)
graph.add_node("validation", validation)
graph.add_node("cleaning", CleaningNode)
graph.add_node("analytics", CalculateAnalyticsNode)
graph.add_node("visualization", VisualizeData)
graph.add_node("insight", insight)

graph.add_edge(START, "schema_detection")
graph.add_edge("schema_detection", "validation")
graph.add_edge("validation", "cleaning")
graph.add_edge("cleaning", "analytics")
graph.add_edge("analytics", "visualization")
graph.add_edge("visualization", "insight")
graph.add_edge("insight", END)
graph = graph.compile()
