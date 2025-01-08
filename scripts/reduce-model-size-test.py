from reduce import reduce_model_size

if __name__ == "__main__":
    gs_model = reduce_model_size("./public/mcmc-vsc-truck-low-4_model.ply")
    gs_model.save_ply("./public/mcmc-vsc-truck-low-4_model-culled.ply")