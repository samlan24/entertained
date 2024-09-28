import multiprocessing

bind = "0.0.0.0:5000"  # Bind to all interfaces on port 8000
workers = multiprocessing.cpu_count() # Set the number of workers
timeout = 60  # Set timeout for workers