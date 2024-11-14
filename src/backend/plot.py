import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Define the sphere
phi, theta = np.mgrid[0.0:2.0 * np.pi:100j, 0.0:np.pi:50j]
x = np.sin(theta) * np.cos(phi)
y = np.sin(theta) * np.sin(phi)
z = np.cos(theta)

# Create the 3D surface plot
fig = go.Figure(data=[go.Surface(x=x, y=y, z=z)])

# Set a big layout
fig.update_layout(
    title="3D Sphere",
    autosize=False,
    width=1000,
    height=1000,
    scene=dict(
        xaxis_title='X',
        yaxis_title='Y',
        zaxis_title='Z'
    )
)

# Convert figure to JSON
plot_data_json = pio.to_json(fig)
print(plot_data_json)